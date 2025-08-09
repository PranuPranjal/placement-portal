/*
  Warnings:

  - You are about to drop the column `registrationNumaber` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "registrationNumaber",
ADD COLUMN     "registrationNumber" INTEGER;
