/*
  Warnings:

  - You are about to drop the column `shipping_fee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SingleOrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_user_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shipping_fee",
DROP COLUMN "total",
ADD COLUMN     "payment_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "shipping_cost" SET DEFAULT 0,
ALTER COLUMN "shipping_cost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "avg_rating" SET DEFAULT 0,
ALTER COLUMN "avg_rating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "images" SET DEFAULT ARRAY['']::TEXT[];

-- AlterTable
ALTER TABLE "SingleOrderItem" DROP COLUMN "price";

-- DropTable
DROP TABLE "Payment";
