/*
  Warnings:

  - You are about to drop the column `image` on the `Category` table. All the data in the column will be lost.
  - Added the required column `img_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_src` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image",
ADD COLUMN     "img_id" TEXT NOT NULL,
ADD COLUMN     "img_src" TEXT NOT NULL;
