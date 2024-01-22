/*
  Warnings:

  - You are about to drop the column `achievementid` on the `achieved` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `achieved` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `achieved` table. All the data in the column will be lost.
  - You are about to drop the `achievements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `index` to the `achieved` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "achieved" DROP CONSTRAINT "achieved_achievementid_fkey";

-- AlterTable
ALTER TABLE "achieved" DROP COLUMN "achievementid",
DROP COLUMN "count",
DROP COLUMN "created_at",
ADD COLUMN     "index" INTEGER NOT NULL;

-- DropTable
DROP TABLE "achievements";
