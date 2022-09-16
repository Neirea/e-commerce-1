/*
  Warnings:

  - You are about to drop the `_variant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_variant" DROP CONSTRAINT "_variant_A_fkey";

-- DropForeignKey
ALTER TABLE "_variant" DROP CONSTRAINT "_variant_B_fkey";

-- DropTable
DROP TABLE "_variant";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("product_id","variant_id")
);

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
