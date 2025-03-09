/*
  Warnings:

  - The values [EMAIL] on the enum `Account` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Account_new" AS ENUM ('GOOGLE', 'GITHUB');
ALTER TABLE "User" ALTER COLUMN "Account" TYPE "Account_new" USING ("Account"::text::"Account_new");
ALTER TYPE "Account" RENAME TO "Account_old";
ALTER TYPE "Account_new" RENAME TO "Account";
DROP TYPE "Account_old";
COMMIT;
