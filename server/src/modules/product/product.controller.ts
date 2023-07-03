import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import {
    FilteredProductsQueryDto,
    FilteredProductsResponseDto,
} from "./dto/filtered-products.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductId } from "./product.types";
import { parseArrayQuery } from "src/pipes/parseArrayQuery";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/common/roles/roles.guard";
import { ApiTags, ApiCookieAuth } from "@nestjs/swagger";
import { ProductWithImagesDto } from "./dto/product-with-images.dto";
import {
    SearchDataQueryDto,
    SearchDataResponseDto,
} from "./dto/search-data.dto";
import { SearchResponseDto } from "./dto/search.dto";
import { ProductByIdResponseDto } from "./dto/product-by-id.dto";
import { ProductWithVariantsDto } from "./dto/get-product.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@ApiTags("product")
@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts(): Promise<ProductWithVariantsDto[]> {
        return this.productService.getProducts();
    }

    @Get("some")
    getProductsByIds(
        @Query("ids", parseArrayQuery)
        ids: ProductId[] | undefined,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getProductsByIds(ids);
    }

    @Get("data")
    getSeachData(
        @Query() query: SearchDataQueryDto,
    ): Promise<SearchDataResponseDto> {
        return this.productService.getSearchData(query);
    }

    @Get("filter")
    getFilteredProducts(
        @Query() query: FilteredProductsQueryDto,
    ): Promise<FilteredProductsResponseDto[]> {
        return this.productService.getFilteredProducts(query);
    }

    @Get("featured")
    getFeaturedProducts(
        @Query() query: FeaturedProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getFeaturedProducts(query);
    }

    @Get("related")
    getRelatedProducts(
        @Query() query: RelatedProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getRelatedProducts(query);
    }

    @Get("popular")
    getPopularProducts(
        @Query() query: PopularProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getPopularProducts(query);
    }

    @Get("search")
    getSearch(@Query("v") query: string): Promise<SearchResponseDto> {
        return this.productService.getSearchBarData(query);
    }

    @Get(":id")
    getProductById(
        @Param("id") id: ProductId,
    ): Promise<ProductByIdResponseDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @ApiCookieAuth()
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    createProduct(@Body() body: CreateProductDto): Promise<void> {
        return this.productService.createProduct(body);
    }

    @Patch(":id")
    @ApiCookieAuth()
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    updateProduct(
        @Param("id") id: ProductId,
        @Body() body: UpdateProductDto,
    ): void {
        this.productService.updateProduct(id, body);
    }

    @Delete(":id")
    @ApiCookieAuth()
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    deleteProduct(@Param("id") id: ProductId): void {
        this.productService.deleteproduct(id);
    }
}
