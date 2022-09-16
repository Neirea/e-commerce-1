/*
  Warnings:

  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_variant_id_fkey";

-- DropTable
DROP TABLE "ProductVariant";

-- CreateTable
CREATE TABLE "_variants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_variants_AB_unique" ON "_variants"("A", "B");

-- CreateIndex
CREATE INDEX "_variants_B_index" ON "_variants"("B");

-- AddForeignKey
ALTER TABLE "_variants" ADD CONSTRAINT "_variants_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_variants" ADD CONSTRAINT "_variants_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
