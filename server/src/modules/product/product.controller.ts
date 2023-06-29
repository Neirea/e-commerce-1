import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchDataDto } from "./dto/search-data.dto";
import { FilteredProductsDto } from "./dto/filtered-products.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductId } from "./product.types";
import { parseArrayQuery } from "src/pipes/parseArrayQuery";

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts() {
        return this.productService.getProducts();
    }

    @Get("some")
    getProductsByIds(
        @Query("ids", parseArrayQuery)
        ids: ProductId[],
    ) {
        return this.productService.getProductsByIds(ids);
    }

    @Get("data")
    getSeachData(@Query() query: SearchDataDto) {
        return this.productService.getSearchData(query);
    }

    @Get("filter")
    getFilteredProducts(@Query() query: FilteredProductsDto) {
        return this.productService.getFilteredProducts(query);
    }

    @Get("featured")
    getFeaturedProducts(@Query() query: FeaturedProductsDto) {
        return this.productService.getFeaturedProducts(query);
    }

    @Get("related")
    getRelatedProducts(@Query() query: RelatedProductsDto) {
        return this.productService.getRelatedProducts(query);
    }

    @Get("popular")
    getPopularProducts(@Query() query: PopularProductsDto) {
        return this.productService.getPopularProducts(query);
    }

    @Get("search")
    getSearch(@Query("v") query: string) {
        return this.productService.getSearchBarData(query);
    }

    @Post()
    createProduct(@Body() body: CreateProductDto) {
        return this.productService.createProduct(body);
    }

    @Get(":id")
    getProductById(@Param("id") id: ProductId) {
        return this.productService.getProductById(id);
    }

    @Patch(":id")
    updateProduct(@Param("id") id: ProductId, body: UpdateProductDto) {
        return this.productService.updateProduct(id, body);
    }

    @Delete(":id")
    deleteProduct(@Param("id") id: ProductId) {
        return this.productService.deleteproduct(id);
    }
}
