import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoryModule } from "./modules/category/category.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";
import { CompanyModule } from "./modules/company/company.module";
import { EditorModule } from "./modules/editor/editor.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProductModule } from "./modules/product/product.module";
import { RedisModule } from "./modules/redis/redis.module";
import { UserModule } from "./modules/user/user.module";
import { AppController } from "./app.controller";
import { PrismaService } from "./modules/prisma/prisma.service";

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
    providers: [PrismaService],
})
export class AppModule {}
