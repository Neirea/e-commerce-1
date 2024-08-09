import { Injectable } from "@nestjs/common";
import { ProductImage } from "@prisma/client";
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
    deleteImagesQuery,
    deleteProductQuery,
    featuredProductsQuery,
    filteredProductsQuery,
    getImagesQuery,
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
import { TProductId, TSearchData } from "./product.types";
import { TCategoryId } from "../category/category.types";
import { TCompanyId } from "../company/company.types";
import {
    TProductCount,
    getArrayWithProductCount,
    getPriceCondition,
    setAndCount,
} from "./utils/search-data";
import { ProductWithImagesDto } from "./dto/product-with-images.dto";
import { SearchResponseDto } from "./dto/search.dto";
import { ProductByIdResponseDto } from "./dto/product-by-id.dto";
import { ProductWithVariantsDto } from "./dto/get-product.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService,
    ) {}

    getProducts(): Promise<ProductWithVariantsDto[]> {
        return this.prisma.$queryRaw<ProductWithVariantsDto[]>(getProducts);
    }

    async getProductById(id: TProductId): Promise<ProductByIdResponseDto> {
        const product = await this.prisma.$queryRaw<[ProductByIdResponseDto]>(
            getProductByIdQuery(id),
        );
        return product[0];
    }

    getProductsByIds(ids: TProductId[]): Promise<ProductWithImagesDto[]> {
        if (!ids.length) return Promise.resolve([]);
        return this.prisma.$queryRaw(getProductsByIdsQuery(ids));
    }

    async getSearchData(
        input: SearchDataQueryDto,
    ): Promise<SearchDataResponseDto> {
        const searchTCategoryIds: TCategoryId[] = [];
        if (input.category_id) {
            const res = await this.prisma.$queryRaw<{ id: TCategoryId }[]>(
                subCategoriesQuery(input.category_id),
            );
            res.forEach((i) => searchTCategoryIds.push(i.id));
        }

        const data = await this.prisma.$queryRaw<TSearchData[]>(
            getSearchDataQuery(input, searchTCategoryIds),
        );

        let min = Infinity;
        let max = 0;
        const allCategories = new Map<TCategoryId, ExtendedCategory>();
        const allCompanies = new Map<TCompanyId, ExtendedCompany>();
        const catCount: TProductCount = {};
        const compCount: TProductCount = {};

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
        const searchTCategoryIds: TProductId[] = [];
        if (category_id) {
            const res = await this.prisma.$queryRaw<{ id: TProductId }[]>(
                subCategoriesQuery(category_id),
            );
            res.forEach((i) => searchTCategoryIds.push(i.id));
        }

        return this.prisma.$queryRaw(
            filteredProductsQuery(input, searchTCategoryIds),
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
        await this.prisma.$transaction([createdProduct, updateCategory]);
    }
    async updateProduct(
        id: TProductId,
        input: UpdateProductDto,
    ): Promise<void> {
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

        // no new images
        if (!img_id.length) {
            await this.prisma.$transaction([productUpdate, categoryUpdate]);
            return;
        }

        const getOldImages = this.prisma.$queryRaw<ProductImage[]>(
            getImagesQuery(id),
        );
        const deleteOldImages = this.prisma.$queryRaw(deleteImagesQuery(id));
        const [oldImages] = await this.prisma.$transaction([
            getOldImages,
            deleteOldImages,
            productUpdate,
            categoryUpdate,
        ]);
        const imgIds = oldImages.map((i) => i.img_id);
        this.cloudinary.deleteMany(imgIds);
    }
    async deleteproduct(id: TProductId): Promise<void> {
        const imagesQuery = this.prisma.$queryRaw<ProductImage[]>(
            getImagesQuery(id),
        );
        const deleteQuery = this.prisma.$queryRaw(deleteProductQuery(id));
        const [images] = await this.prisma.$transaction([
            imagesQuery,
            deleteQuery,
        ]);

        if (images.length) {
            this.cloudinary.deleteMany(images.map((i) => i.img_id));
        }
    }
}
