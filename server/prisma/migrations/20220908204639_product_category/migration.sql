/*
  Warnings:

  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category_id" INTEGER NOT NULL;
