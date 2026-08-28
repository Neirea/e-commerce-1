import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module.js";
import { CategoryModule } from "./modules/category/category.module.js";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module.js";
import { CompanyModule } from "./modules/company/company.module.js";
import { EditorModule } from "./modules/editor/editor.module.js";
import { OrderModule } from "./modules/order/order.module.js";
import { PaymentModule } from "./modules/payment/payment.module.js";
import { PrismaModule } from "./modules/prisma/prisma.module.js";
import { ProductModule } from "./modules/product/product.module.js";
import { RedisModule } from "./modules/redis/redis.module.js";
import { UserModule } from "./modules/user/user.module.js";
import { AppController } from "./app.controller.js";

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        PaymentModule,
        EditorModule,
        CategoryModule,
        CompanyModule,
        OrderModule,
        ProductModule,
        UserModule,
        CloudinaryModule,
        RedisModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
