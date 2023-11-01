/*
  Warnings:

  - You are about to drop the column `room_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `room` on the `room_particiants` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `room_particiants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sender]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_id]` on the table `room_particiants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `room_particiants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `room_particiants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `room_particiants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_room_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropIndex
DROP INDEX "messages_room_id_key";

-- DropIndex
DROP INDEX "messages_sender_id_key";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "room_id",
DROP COLUMN "sender_id",
ADD COLUMN     "room" INTEGER NOT NULL,
ADD COLUMN     "sender" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_particiants" DROP COLUMN "room",
DROP COLUMN "user",
ADD COLUMN     "room_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "messages_room_key" ON "messages"("room");

-- CreateIndex
CREATE UNIQUE INDEX "messages_sender_key" ON "messages"("sender");

-- CreateIndex
CREATE UNIQUE INDEX "room_particiants_room_id_key" ON "room_particiants"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_particiants_user_id_key" ON "room_particiants"("user_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_fkey" FOREIGN KEY ("room") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_particiants" ADD CONSTRAINT "room_particiants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_particiants" ADD CONSTRAINT "room_particiants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
