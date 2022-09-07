/*
  Warnings:

  - You are about to drop the column `category_id` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_category_id_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "category_id";

-- CreateTable
CREATE TABLE "_CategoryToCompany" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCompany_AB_unique" ON "_CategoryToCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCompany_B_index" ON "_CategoryToCompany"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToCompany" ADD CONSTRAINT "_CategoryToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompany" ADD CONSTRAINT "_CategoryToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
