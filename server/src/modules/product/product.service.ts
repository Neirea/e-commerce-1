import { Injectable } from "@nestjs/common";
import { ProductImage } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { FilteredProductsDto } from "./dto/filtered-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { SearchDataDto } from "./dto/search-data.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
    deleteOldImagesQuery,
    featuredProductsQuery,
    filteredProductsQuery,
    getOldImagesQuery,
    getProductByIdQuery,
    getProducts,
    getProductsByIdsQuery,
    getSearchDataQuery,
    popularProductsQuery,
    relatedProductsQuery,
    searchBarDataQuery,
    updateProductCategoryQuery,
} from "./product.queries";
import { subCategoriesQuery } from "./utils/sql";
import {
    CategoryType,
    CompanyType,
    ProductId,
    ProductWithCatCom,
    ProductWithImages,
    ProductWithImgVariants,
    ProductWithVariants,
    SearchDataResponse,
    SearchDataType,
    SearchResult,
} from "./product.types";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    getProducts(): Promise<ProductWithVariants[]> {
        return this.prisma.$queryRaw<ProductWithVariants[]>(getProducts);
    }

    async getProductById(id: ProductId): Promise<ProductWithImgVariants> {
        const product = await this.prisma.$queryRaw<[ProductWithImgVariants]>(
            getProductByIdQuery(id),
        );
        return product[0];
    }
    getProductsByIds(ids: ProductId[]): Promise<ProductWithImages[]> {
        if (!ids) return Promise.resolve([]);
        return this.prisma.$queryRaw(getProductsByIdsQuery(ids));
    }
    async getSearchData(input: SearchDataDto): SearchDataResponse {
        const searchCategoryIds: ProductId[] = [];
        if (input.category_id) {
            const res = await this.prisma.$queryRaw<{ id: ProductId }[]>(
                subCategoriesQuery(input.category_id),
            );
            res.forEach((i) => searchCategoryIds.push(i.id));
        }

        const data = await this.prisma.$queryRaw<SearchDataType>(
            getSearchDataQuery(input, searchCategoryIds),
        );

        let min = 2147483647; // Infinity?
        let max = 0;
        const allCategories: CategoryType[] = [];
        const allCompanies: CompanyType[] = [];
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
    async getFilteredProducts(
        input: FilteredProductsDto,
    ): Promise<ProductWithCatCom[]> {
        const { category_id } = input;
        const searchCategoryIds: ProductId[] = [];
        if (category_id) {
            const res = await this.prisma.$queryRaw<{ id: ProductId }[]>`
                ${subCategoriesQuery(category_id)}
                `;
            res.forEach((i) => searchCategoryIds.push(i.id));
        }

        return this.prisma.$queryRaw(
            filteredProductsQuery(input, searchCategoryIds),
        );
    }

    getFeaturedProducts(
        input: FeaturedProductsDto,
    ): Promise<ProductWithImages[]> {
        return this.prisma.$queryRaw<ProductWithImages[]>(
            featuredProductsQuery(input),
        );
    }
    getRelatedProducts(
        input: RelatedProductsDto,
    ): Promise<ProductWithImages[]> {
        //get products with same company(ordered first) and same category
        return this.prisma.$queryRaw<ProductWithImages[]>(
            relatedProductsQuery(input),
        );
    }
    getPopularProducts(
        input: PopularProductsDto,
    ): Promise<ProductWithImages[]> {
        return this.prisma.$queryRaw<ProductWithImages[]>(
            popularProductsQuery(input),
        );
    }
    getSearchBarData(input: string): Promise<SearchResult> {
        return this.prisma.$queryRaw<SearchResult>(searchBarDataQuery(input));
    }

    async createProduct(input: CreateProductDto): Promise<void> {
        const { variants, img_id, img_src, ...createData } = input;

        //create product, create product images and connection to variants
        const connectArr = variants?.map((p_id) => {
            return { id: p_id };
        });
        const productImages = img_id.map((img, i) => {
            return { img_id: img, img_src: img_src[i] };
        });

        // connects variants many-to-many on creation
        const createdProduct = this.prisma.product.create({
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
        const updateCategory = this.prisma.$queryRaw(
            updateProductCategoryQuery(input),
        );

        await Promise.all([createdProduct, updateCategory]);
    }
    async updateProduct(id: ProductId, input: UpdateProductDto): Promise<void> {
        const { variants, img_id, img_src, ...updateData } = input;

        //update product, create product images and connection to variants
        const newVariants = variants?.map((p_id) => {
            return { id: p_id };
        });
        const newProductImages = img_id.map((img, i) => {
            return { img_id: img, img_src: img_src[i] };
        });

        const productUpdate = this.prisma.product.update({
            where: { id: id },
            data: {
                ...updateData,
                images: {
                    create: newProductImages,
                },
                variants: {
                    connect: newVariants,
                },
                variantsRelation: {
                    connect: newVariants,
                },
            },
        });

        //update relation between company and category
        const categoryUpdate = this.prisma.$queryRaw(
            updateProductCategoryQuery(input),
        );

        //delete old images
        if (img_id.length) {
            const oldImages = await this.prisma.$queryRaw<ProductImage[]>(
                getOldImagesQuery(id),
            );
            this.prisma.$queryRaw(deleteOldImagesQuery(id));
            cloudinary.api.delete_resources(oldImages.map((i) => i.img_id));
        }

        const promiseArray = [productUpdate, categoryUpdate];
        await Promise.all(promiseArray);
    }
    async deleteproduct(id: ProductId): Promise<void> {
        const data = await this.prisma.product.delete({
            where: { id: id },
            include: { images: true },
        });

        if (data.images.length) {
            cloudinary.api.delete_resources(data.images.map((i) => i.img_id));
        }
    }
}
