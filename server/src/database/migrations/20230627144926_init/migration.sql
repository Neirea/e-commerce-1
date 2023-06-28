-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PROCESSING', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('GOOGLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EDITOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "given_name" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,
    "email" TEXT,
    "platform_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "role" "Role"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" JSONB NOT NULL,
    "inventory" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "shipping_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "img_id" TEXT NOT NULL,
    "img_src" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("img_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img_id" TEXT,
    "img_src" TEXT,
    "parent_id" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "shipping_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" INTEGER,
    "buyer_name" TEXT NOT NULL,
    "buyer_email" TEXT NOT NULL,
    "buyer_phone" TEXT,
    "delivery_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_time" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleOrderItem" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "SingleOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_variants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToCompany" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_platform_id_key" ON "User"("platform_id");

-- CreateIndex
CREATE INDEX "Product_inventory_idx" ON "Product"("inventory");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_discount_idx" ON "Product"("discount");

-- CreateIndex
CREATE INDEX "Product_company_id_idx" ON "Product" USING HASH ("company_id");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product" USING HASH ("category_id");

-- CreateIndex
CREATE INDEX "ProductImage_product_id_idx" ON "ProductImage" USING HASH ("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_parent_id_idx" ON "Category" USING HASH ("parent_id");

-- CreateIndex
CREATE INDEX "Order_user_id_idx" ON "Order" USING HASH ("user_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "SingleOrderItem_order_id_idx" ON "SingleOrderItem" USING HASH ("order_id");

-- CreateIndex
CREATE INDEX "SingleOrderItem_product_id_idx" ON "SingleOrderItem" USING HASH ("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "_variants_AB_unique" ON "_variants"("A", "B");

-- CreateIndex
CREATE INDEX "_variants_B_index" ON "_variants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCompany_AB_unique" ON "_CategoryToCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCompany_B_index" ON "_CategoryToCompany"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleOrderItem" ADD CONSTRAINT "SingleOrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleOrderItem" ADD CONSTRAINT "SingleOrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_variants" ADD CONSTRAINT "_variants_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_variants" ADD CONSTRAINT "_variants_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompany" ADD CONSTRAINT "_CategoryToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompany" ADD CONSTRAINT "_CategoryToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
