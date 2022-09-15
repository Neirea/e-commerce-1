/*
  Warnings:

  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `src` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `img_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_src` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "id",
DROP COLUMN "src",
ADD COLUMN     "img_id" TEXT NOT NULL,
ADD COLUMN     "img_src" TEXT NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("img_id");
