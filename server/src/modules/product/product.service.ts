import { Injectable } from "@nestjs/common";
import { ProductImage } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import {
    FilteredProductsQueryDto,
    FilteredProductsResponseDto,
} from "./dto/filtered-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import {
    ExtendedCategory,
    ExtendedCompany,
    SearchDataQueryDto,
    SearchDataResponseDto,
} from "./dto/search-data.dto";
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
import { ProductId, SearchDataType } from "./product.types";
import { CategoryId } from "../category/category.types";
import { CompanyId } from "../company/company.types";
import {
    ProductCountType,
    getArrayWithProductCount,
    getPriceCondition,
    setAndCount,
} from "./utils/search-data";
import { ProductWithImagesDto } from "./dto/product-with-images.dto";
import { SearchResponseDto } from "./dto/search.dto";
import { ProductByIdResponseDto } from "./dto/product-by-id.dto";
import { ProductWithVariantsDto } from "./dto/get-product.dto";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    getProducts(): Promise<ProductWithVariantsDto[]> {
        return this.prisma.$queryRaw<ProductWithVariantsDto[]>(getProducts);
    }

    async getProductById(id: ProductId): Promise<ProductByIdResponseDto> {
        const product = await this.prisma.$queryRaw<[ProductByIdResponseDto]>(
            getProductByIdQuery(id),
        );
        return product[0];
    }

    getProductsByIds(ids: ProductId[]): Promise<ProductWithImagesDto[]> {
        if (!ids) return Promise.resolve([]);
        return this.prisma.$queryRaw(getProductsByIdsQuery(ids));
    }

    async getSearchData(
        input: SearchDataQueryDto,
    ): Promise<SearchDataResponseDto> {
        const searchCategoryIds: CategoryId[] = [];
        if (input.category_id) {
            const res = await this.prisma.$queryRaw<{ id: CategoryId }[]>(
                subCategoriesQuery(input.category_id),
            );
            res.forEach((i) => searchCategoryIds.push(i.id));
        }

        const data = await this.prisma.$queryRaw<SearchDataType>(
            getSearchDataQuery(input, searchCategoryIds),
        );

        let min = Infinity;
        let max = 0;
        const allCategories = new Map<CategoryId, ExtendedCategory>();
        const allCompanies = new Map<CompanyId, ExtendedCompany>();
        const catCount: ProductCountType = {};
        const compCount: ProductCountType = {};

        data.forEach((p) => {
            const price = ((100 - p.discount) / 100) * p.price;
            //finding min/max
            if (price < min) min = price;
            if (price > max) max = price;
            // finding unique items and product count
            if (getPriceCondition(price, input.min_price, input.max_price)) {
                setAndCount(allCategories, p.category, catCount);
                if (p.category.parent != null) {
                    setAndCount(allCategories, p.category.parent, catCount);
                }
                setAndCount(allCompanies, p.company, compCount);
            }
        });
        if (min === Infinity) min = 0;

        const categories = getArrayWithProductCount(allCategories, catCount);
        const companies = getArrayWithProductCount(allCompanies, compCount);

        return {
            min: Math.floor(min),
            max: Math.ceil(max),
            categories,
            companies,
        };
    }

    async getFilteredProducts(
        input: FilteredProductsQueryDto,
    ): Promise<FilteredProductsResponseDto[]> {
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
    ): Promise<ProductWithImagesDto[]> {
        return this.prisma.$queryRaw<ProductWithImagesDto[]>(
            featuredProductsQuery(input),
        );
    }
    getRelatedProducts(
        input: RelatedProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        //get products with same company(ordered first) and same category
        return this.prisma.$queryRaw<ProductWithImagesDto[]>(
            relatedProductsQuery(input),
        );
    }
    getPopularProducts(
        input: PopularProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.prisma.$queryRaw<ProductWithImagesDto[]>(
            popularProductsQuery(input),
        );
    }
    getSearchBarData(input: string): Promise<SearchResponseDto> {
        return this.prisma.$queryRaw<SearchResponseDto>(
            searchBarDataQuery(input),
        );
    }

    async createProduct(input: CreateProductDto): Promise<void> {
        const { variants, img_id, img_src, ...createData } = input;

        //create product, create product images and connection to variants
        const connectArr = variants.map((p_id) => {
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
        const newVariants = variants.map((p_id) => {
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
