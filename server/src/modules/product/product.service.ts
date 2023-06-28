import { Injectable } from "@nestjs/common";
import { Category, Company, Product } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { FilteredProductsDto } from "./dto/filtered-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { ProductsByIdsDto } from "./dto/products-by-ids.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { SearchDataDto } from "./dto/search-data.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { updateProduct } from "./queries/update-product";
import {
    featuredProductsQuery,
    filteredProductsQuery,
    getProductByIdQuery,
    getProducts,
    getProductsByIdsQuery,
    getSearchDataQuery,
    popularProductsQuery,
    relatedProductsQuery,
    searchBarDataQuery,
    updateProductCategoryQuery,
} from "./product.queries";
import { subCategoriesQuery } from "./queries/utils";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    getProducts() {
        return this.prisma.$queryRaw<Product[]>`${getProducts}`;
    }

    async getProductById(id: number) {
        const product = await this.prisma.$queryRaw<
            [Product]
        >`${getProductByIdQuery(id)}`;
        return product[0];
    }
    getProductsByIds(input: ProductsByIdsDto) {
        //any
        // if (!input.ids.length || !input.ids) return [];
        return this.prisma.$queryRaw`${getProductsByIdsQuery(input)}`;
    }
    async getSearchData(input: SearchDataDto) {
        const searchCategoryIds: number[] = [];
        if (input.category_id) {
            const res = await this.prisma.$queryRaw<{ id: number }[]>`
                ${subCategoriesQuery(input.category_id)}`;
            res.forEach((i) => searchCategoryIds.push(i.id));
        }

        type SearchDataType = {
            company: Company;
            category: Category;
            price: number;
            discount: number;
        }[];

        const data = await this.prisma
            .$queryRaw<SearchDataType>`${getSearchDataQuery(
            input,
            searchCategoryIds,
        )}`;

        let min = Infinity; //2147483647
        let max = 0;
        type CategoryType = Category & { productCount?: number } & {
            parent?: Category | null;
        };
        type CompanyType = Company & { productCount?: number };
        const allCategories: CategoryType[] = [];
        const allCompanies: CompanyType[] = [];
        const maxPrice = input.max_price ?? Infinity;
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
        if (min === Infinity) min = 0;
        //push parent categories
        allCategories.forEach((elem) => {
            if (elem.parent && elem.parent.id != null) {
                allCategories.push(elem.parent);
            }
        });

        //get unique categories, companies
        const categories = [
            ...new Map(
                allCategories.map((item) => [item["id"], item]),
            ).values(),
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
    }
    async getFilteredProducts(input: FilteredProductsDto) {
        //any
        const { product } = input;
        const searchCategoryIds: number[] = [];
        if (product.category_id) {
            const res = await this.prisma.$queryRaw<{ id: number }[]>`
                ${subCategoriesQuery(product.category_id)}
                `;
            res.forEach((i) => searchCategoryIds.push(i.id));
        }

        return this.prisma.$queryRaw`${filteredProductsQuery(
            input,
            searchCategoryIds,
        )}
        `;
    }

    getFeaturedProducts(input: FeaturedProductsDto) {
        return this.prisma.$queryRaw`${featuredProductsQuery(input)}`;
    }
    getRelatedProducts(input: RelatedProductsDto) {
        //get products with same company(ordered first) and same category
        return this.prisma.$queryRaw`${relatedProductsQuery(input)}`;
    }
    getPopularProducts(input: PopularProductsDto) {
        return this.prisma.$queryRaw`${popularProductsQuery(input)}`;
    }
    getSearchBarData(input: string) {
        return this.prisma.$queryRaw`${searchBarDataQuery(input)}`;
    }

    async createProduct(input: CreateProductDto) {
        //any
        // if (!req.session.user?.role.includes(Role.EDITOR)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        const { variants, img_id, img_src, ...createData } = input;
        // if (input.name.length < 3) throw new UserInputError("Name is too short");

        //create product, create product images and connection to variants
        const connectArr = variants?.map((p_id) => {
            return { id: p_id };
        });
        const productImages = img_id.map((img, i) => {
            return { img_id: img, img_src: img_src[i] };
        });

        // connects variants many-to-many on creation
        const createProduct = this.prisma.product.create({
            data: {
                ...createData,
                images: {
                    create: productImages,
                },
                variants: {
                    connect: connectArr,
                },
                variantsRelation: {
                    connect: connectArr,
                },
            },
        });
        //create connection between company and category
        const updateCategory = this.prisma
            .$queryRaw`${updateProductCategoryQuery(input)}`;

        await Promise.all([createProduct, updateCategory]);
        return true;
    }
    updateProduct(id: number, input: UpdateProductDto) {
        return updateProduct(this.prisma, id, input);
    }
    async deleteproduct(input: number) {
        // if (!req.session.user?.role.includes(Role.EDITOR)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        const data = await this.prisma.product.delete({
            where: { id: input },
            include: { images: true },
        });

        if (data.images.length) {
            cloudinary.api.delete_resources(data.images.map((i) => i.img_id));
        }
        return true;
    }
}
