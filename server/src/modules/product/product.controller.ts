import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchDataDto } from "./dto/search-data.dto";
import { FilteredProductsDto } from "./dto/filtered-products.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
    ProductId,
    ProductWithCatCom,
    ProductWithImages,
    ProductWithImgVariants,
    SearchDataResponse,
    SearchResult,
} from "./product.types";
import { parseArrayQuery } from "src/pipes/parseArrayQuery";
import { Roles } from "src/common/roles/roles.decorator";
import { Product, Role } from "@prisma/client";
import { RolesGuard } from "src/common/roles/roles.guard";

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    @Get("some")
    getProductsByIds(
        @Query("ids", parseArrayQuery)
        ids: ProductId[] | undefined,
    ): Promise<ProductWithImages[]> {
        return this.productService.getProductsByIds(ids);
    }

    @Get("data")
    getSeachData(@Query() query: SearchDataDto): SearchDataResponse {
        return this.productService.getSearchData(query);
    }

    @Get("filter")
    getFilteredProducts(
        @Query() query: FilteredProductsDto,
    ): Promise<ProductWithCatCom[]> {
        return this.productService.getFilteredProducts(query);
    }

    @Get("featured")
    getFeaturedProducts(
        @Query() query: FeaturedProductsDto,
    ): Promise<ProductWithImages[]> {
        return this.productService.getFeaturedProducts(query);
    }

    @Get("related")
    getRelatedProducts(
        @Query() query: RelatedProductsDto,
    ): Promise<ProductWithImages[]> {
        return this.productService.getRelatedProducts(query);
    }

    @Get("popular")
    getPopularProducts(
        @Query() query: PopularProductsDto,
    ): Promise<ProductWithImages[]> {
        return this.productService.getPopularProducts(query);
    }

    @Get("search")
    getSearch(@Query("v") query: string): Promise<SearchResult> {
        return this.productService.getSearchBarData(query);
    }

    @Get(":id")
    getProductById(
        @Param("id") id: ProductId,
    ): Promise<ProductWithImgVariants> {
        return this.productService.getProductById(id);
    }

    @Post()
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    createProduct(@Body() body: CreateProductDto): Promise<void> {
        return this.productService.createProduct(body);
    }

    @Patch(":id")
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    updateProduct(
        @Param("id") id: ProductId,
        @Body() body: UpdateProductDto,
    ): Promise<void> {
        return this.productService.updateProduct(id, body);
    }

    @Delete(":id")
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    deleteProduct(@Param("id") id: ProductId): Promise<void> {
        return this.productService.deleteproduct(id);
    }
}
