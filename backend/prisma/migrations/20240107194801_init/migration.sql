/*
  Warnings:

  - The `is2FA` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `secret2FA` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "is2FA",
ADD COLUMN     "is2FA" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "secret2FA",
ADD COLUMN     "secret2FA" BOOLEAN NOT NULL DEFAULT false;
