/*
  Warnings:

  - The values [PENDING] on the enum `game_state` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "game_state_new" AS ENUM ('IN_PLAY', 'FINISHED');
ALTER TABLE "matchhistory" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "matchhistory" ALTER COLUMN "state" TYPE "game_state_new" USING ("state"::text::"game_state_new");
ALTER TYPE "game_state" RENAME TO "game_state_old";
ALTER TYPE "game_state_new" RENAME TO "game_state";
DROP TYPE "game_state_old";
ALTER TABLE "matchhistory" ALTER COLUMN "state" SET DEFAULT 'IN_PLAY';
COMMIT;

-- AlterTable
ALTER TABLE "invites" ADD COLUMN     "game_id" TEXT;

-- AlterTable
ALTER TABLE "matchhistory" ALTER COLUMN "winner_id" DROP NOT NULL,
ALTER COLUMN "winner_id" DROP DEFAULT,
ALTER COLUMN "loser_id" DROP NOT NULL,
ALTER COLUMN "loser_id" DROP DEFAULT,
ALTER COLUMN "state" SET DEFAULT 'IN_PLAY';

-- AlterTable
ALTER TABLE "rooms_members" ADD COLUMN     "mutetime" TIMESTAMP(3);
