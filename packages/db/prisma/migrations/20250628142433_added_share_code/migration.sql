/*
  Warnings:

  - The required column `share_code` was added to the `Projects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "share_code" TEXT NOT NULL;
