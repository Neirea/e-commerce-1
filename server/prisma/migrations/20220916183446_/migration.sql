/*
  Warnings:

  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_variant_by_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_variant_to_id_fkey";

-- DropTable
DROP TABLE "ProductVariant";

-- CreateTable
CREATE TABLE "_variant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_variant_AB_unique" ON "_variant"("A", "B");

-- CreateIndex
CREATE INDEX "_variant_B_index" ON "_variant"("B");

-- AddForeignKey
ALTER TABLE "_variant" ADD CONSTRAINT "_variant_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_variant" ADD CONSTRAINT "_variant_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
