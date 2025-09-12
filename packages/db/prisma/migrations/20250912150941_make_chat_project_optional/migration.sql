-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_projectId_fkey";

-- AlterTable
ALTER TABLE "Chats" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
