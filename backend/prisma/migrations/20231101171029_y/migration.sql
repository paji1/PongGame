/*
  Warnings:

  - Added the required column `type` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roomType" AS ENUM ('chat', 'group_public', 'group_private', 'group_protected');

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "type" "roomType" NOT NULL;
