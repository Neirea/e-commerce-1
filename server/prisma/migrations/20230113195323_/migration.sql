-- DropForeignKey
ALTER TABLE "SingleOrderItem" DROP CONSTRAINT "SingleOrderItem_product_id_fkey";

-- AddForeignKey
ALTER TABLE "SingleOrderItem" ADD CONSTRAINT "SingleOrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
