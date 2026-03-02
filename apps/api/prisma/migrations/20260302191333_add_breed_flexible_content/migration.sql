/*
  Warnings:

  - You are about to drop the column `careInstructions` on the `breeds` table. All the data in the column will be lost.
  - You are about to drop the column `characteristics` on the `breeds` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `breeds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "breeds" DROP COLUMN "careInstructions",
DROP COLUMN "characteristics",
DROP COLUMN "photos",
ADD COLUMN     "flexibleContent" JSONB DEFAULT '[]';
