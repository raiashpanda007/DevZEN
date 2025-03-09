/*
  Warnings:

  - A unique constraint covering the columns `[email,Account]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,Account]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_Account_key" ON "User"("email", "Account");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_Account_key" ON "User"("username", "Account");
