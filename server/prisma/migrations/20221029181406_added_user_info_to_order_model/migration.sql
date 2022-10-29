/*
  Warnings:

  - Added the required column `buyer_email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_address` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "buyer_email" TEXT NOT NULL,
ADD COLUMN     "buyer_name" TEXT NOT NULL,
ADD COLUMN     "buyer_phone" TEXT,
ADD COLUMN     "delivery_address" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
