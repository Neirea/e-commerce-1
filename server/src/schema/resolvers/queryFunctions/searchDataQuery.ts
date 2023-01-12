import { Prisma } from "@prisma/client";
import {
    Category,
    Company,
    QuerySearchDataInput,
} from "../../../generated/graphql";
import prisma from "../../../prisma";
import {
    getCategoryCondition,
    getCompanyCondition,
    getSearchCondition,
    subCategoriesQuery,
} from "../sql/Product";
import { getQueryString } from "./utils";

export default async (
    parent: any,
    { input }: { input: QuerySearchDataInput }
) => {
    const searchString = getQueryString(input.search_string);

    const searchCategoryIds: number[] = [];
    if (input.category_id) {
        const res = await prisma.$queryRaw<{ id: number }[]>`
            ${subCategoriesQuery(input.category_id)}`;
        res.forEach((i) => searchCategoryIds.push(i.id));
    }

    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(input.company_id);
    const categoryCondition = getCategoryCondition(
        searchCategoryIds,
        input.category_id
    );

    const categoriesJSON = Prisma.sql`
        SELECT cat.*,pcat.parent
        FROM  public."Category" as cat
        LEFT JOIN (SELECT c1.*, json_build_object('id',c2.id,'name',c2.name) as parent
                FROM public."Category" as c1, public."Category" as c2
                WHERE c1.parent_id = c2.id) as pcat
        ON cat.id = pcat.id
    `;

    const data = await prisma.$queryRaw<
        {
            company: Company;
            category: Category;
            price: number;
            discount: number;
        }[]
    >`
        SELECT p.price, p.discount, p.category_id,
            json_build_object('id',com.id,'name',com.name) as company,
            json_build_object('id',cat.id,'name',cat.name,'parent',cat.parent,'parent_id',cat.parent_id) as category
        FROM public."Product" as p
        INNER JOIN public."Company" as com ON p.company_id = com.id
        INNER JOIN (${categoriesJSON}) as cat ON p.category_id = cat.id
        WHERE (${searchCondition})
            ${companyCondition}
            ${categoryCondition}
    `;

    let min = 2147483647; //max 32bit integer
    let max = 0;
    type ICategory = Category & {
        parent?: Category | null;
    };
    const allCategories: Array<ICategory> = [];
    const allCompanies: Array<Company> = [];
    const maxPrice = input.max_price ?? 2147483647;
    const minPrice = input.min_price ?? 0;
    data.forEach((p) => {
        const price = ((100 - p.discount) / 100) * p.price;
        if (price < min) min = price;
        if (price > max) max = price;
        if (input.max_price || input.min_price) {
            if (price <= maxPrice && price >= minPrice) {
                allCategories.push(p.category);
                allCompanies.push(p.company);
            }
        } else {
            allCategories.push(p.category);
            allCompanies.push(p.company);
        }
    });
    if (min === 2147483647) min = 0;
    //push parent categories
    allCategories.forEach((elem) => {
        if (elem.parent && elem.parent.id != null) {
            allCategories.push(elem.parent);
        }
    });

    //get unique categories, companies
    const categories = [
        ...new Map(allCategories.map((item) => [item["id"], item])).values(),
    ];
    const companies = [
        ...new Map(allCompanies.map((item) => [item["id"], item])).values(),
    ];

    // count products per category, company
    const catCount: { [key: string]: number } = {};
    allCategories.forEach((c) => {
        catCount[c.id] = (catCount[c.id] || 0) + 1;
    });
    const compCount: { [key: string]: number } = {};
    allCompanies.forEach((c) => {
        compCount[c.id] = (compCount[c.id] || 0) + 1;
    });
    categories.forEach((elem) => {
        elem.productCount = catCount[elem.id];
    });
    companies.forEach((elem) => {
        elem.productCount = compCount[elem.id];
    });
    return {
        min: Math.floor(min),
        max: Math.ceil(max),
        categories,
        companies,
    };
};
