/*
  Warnings:

  - You are about to drop the `_Variants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Variants" DROP CONSTRAINT "_Variants_A_fkey";

-- DropForeignKey
ALTER TABLE "_Variants" DROP CONSTRAINT "_Variants_B_fkey";

-- DropTable
DROP TABLE "_Variants";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "variant_by_id" INTEGER NOT NULL,
    "variant_to_id" INTEGER NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("variant_by_id","variant_to_id")
);

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_variant_by_id_fkey" FOREIGN KEY ("variant_by_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_variant_to_id_fkey" FOREIGN KEY ("variant_to_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
