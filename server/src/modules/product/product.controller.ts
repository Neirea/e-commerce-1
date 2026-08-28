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
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service.js";
import {
    FilteredProductsQueryDto,
    FilteredProductsResponseDto,
} from "./dto/filtered-products.dto.js";
import { FeaturedProductsDto } from "./dto/featured-products.dto.js";
import { RelatedProductsDto } from "./dto/related-products.dto.js";
import { PopularProductsDto } from "./dto/popular-products.dto.js";
import { CreateProductDto } from "./dto/create-propduct.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";
import { type TProductId } from "./product.types.js";
import { ParseQuaryArrayPipe } from "../../pipes/parse-ids.pipe.js";
import { Roles } from "../../common/roles/roles.decorator.js";
import { Role } from "../../database/generated/client.js";
import { RolesGuard } from "../../common/roles/roles.guard.js";
import { ApiTags, ApiCookieAuth, ApiOperation } from "@nestjs/swagger";
import { ProductWithImagesDto } from "./dto/product-with-images.dto.js";
import {
    SearchDataQueryDto,
    SearchDataResponseDto,
} from "./dto/search-data.dto.js";
import { SearchResponseDto } from "./dto/search.dto.js";
import { ProductByIdResponseDto } from "./dto/product-by-id.dto.js";
import { ProductWithVariantsDto } from "./dto/get-product.dto.js";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard.js";
import { MultipleUploadsFilter } from "./product.filter.js";

@ApiTags("product")
@Controller("product")
@UseFilters(MultipleUploadsFilter)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ApiOperation({ summary: "Retrieves all products" })
    getProducts(): Promise<ProductWithVariantsDto[]> {
        return this.productService.getProducts();
    }

    @Get("some")
    @ApiOperation({ summary: "Retrieves products by id's" })
    getProductsByIds(
        @Query("ids", new ParseQuaryArrayPipe())
        ids: TProductId[],
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getProductsByIds(ids);
    }

    @Get("data")
    @ApiOperation({ summary: "Retrieves products data based on filters" })
    getSeachData(
        @Query() query: SearchDataQueryDto,
    ): Promise<SearchDataResponseDto> {
        return this.productService.getSearchData(query);
    }

    @Get("filter")
    @ApiOperation({ summary: "Retrieves products based on filters" })
    getFilteredProducts(
        @Query() query: FilteredProductsQueryDto,
    ): Promise<FilteredProductsResponseDto[]> {
        return this.productService.getFilteredProducts(query);
    }

    @Get("featured")
    @ApiOperation({ summary: "Retrieves featured products" })
    getFeaturedProducts(
        @Query() query: FeaturedProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getFeaturedProducts(query);
    }

    @Get("related")
    @ApiOperation({ summary: "Retrieves related products" })
    getRelatedProducts(
        @Query() query: RelatedProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getRelatedProducts(query);
    }

    @Get("popular")
    @ApiOperation({ summary: "Retrieves popular products" })
    getPopularProducts(
        @Query() query: PopularProductsDto,
    ): Promise<ProductWithImagesDto[]> {
        return this.productService.getPopularProducts(query);
    }

    @Get("search")
    @ApiOperation({ summary: "Retrieves data for search bar" })
    getSearch(@Query("v") query: string): Promise<SearchResponseDto> {
        return this.productService.getSearchBarData(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Retrieves specific product" })
    getProductById(
        @Param("id") id: TProductId,
    ): Promise<ProductByIdResponseDto> {
        return this.productService.getProductById(id);
    }

    @Post()
    @ApiOperation({ summary: "Creates product" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    createProduct(@Body() body: CreateProductDto): Promise<void> {
        return this.productService.createProduct(body);
    }

    @Patch(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Updates specific product" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async updateProduct(
        @Param("id") id: TProductId,
        @Body() body: UpdateProductDto,
    ): Promise<void> {
        await this.productService.updateProduct(id, body);
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Deletes specific product" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async deleteProduct(@Param("id") id: TProductId): Promise<void> {
        await this.productService.deleteProduct(id);
    }
}
