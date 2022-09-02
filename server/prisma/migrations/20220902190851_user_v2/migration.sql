/*
  Warnings:

  - You are about to drop the column `name` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platform_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `given_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_user_id_fkey";

-- DropIndex
DROP INDEX "Product_user_id_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "featured",
DROP COLUMN "user_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "username",
ADD COLUMN     "family_name" TEXT NOT NULL,
ADD COLUMN     "given_name" TEXT NOT NULL,
ADD COLUMN     "platform_id" INTEGER NOT NULL,
ALTER COLUMN "avatar" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_platform_id_key" ON "User"("platform_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
