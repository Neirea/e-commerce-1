-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
