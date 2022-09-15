/*
  Warnings:

  - Made the column `given_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `family_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "given_name" SET NOT NULL,
ALTER COLUMN "family_name" SET NOT NULL;
