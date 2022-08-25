/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'https://lh3.googleusercontent.com/a-/AFdZucp97qLPG96CDx5SRgR2Mff2Ju608wdvUGSghz4o5g=s96-c';

-- DropTable
DROP TABLE "Profile";
