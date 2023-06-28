import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { EditorModule } from "./modules/editor/editor.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ProductModule } from "./modules/product/product.module";
import { UserModule } from "./modules/user/user.module";

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
    ],
})
export class AppModule {}
