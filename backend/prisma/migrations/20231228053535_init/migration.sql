-- CreateEnum
CREATE TYPE "participation_type" AS ENUM ('chat', 'participation', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "permission" AS ENUM ('chat', 'private', 'public', 'protected');

-- CreateEnum
CREATE TYPE "friendship_status" AS ENUM ('pending', 'acepted', 'refused');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "user42" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "status" TEXT,
    "hash" TEXT,
    "hashedRt" TEXT,
    "experience_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" SERIAL NOT NULL,
    "condition" INTEGER NOT NULL,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendship" (
    "id" SERIAL NOT NULL,
    "initiator" INTEGER NOT NULL,
    "reciever" INTEGER NOT NULL,
    "status" "friendship_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked" (
    "id" SERIAL NOT NULL,
    "initiator" INTEGER NOT NULL,
    "reciever" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchhistory" (
    "id" SERIAL NOT NULL,
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "score1" INTEGER NOT NULL,
    "score2" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matchhistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "roompassword" TEXT,
    "roomtypeof" "permission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms_members" (
    "id" SERIAL NOT NULL,
    "roomid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "permission" "participation_type" NOT NULL,
    "ismuted" BOOLEAN NOT NULL DEFAULT false,
    "isblocked" BOOLEAN NOT NULL DEFAULT false,
    "muted_at" TIMESTAMP(3),
    "muting_period" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "messages" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "won_xp" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achieved" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "achievementid" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achieved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user42_key" ON "user"("user42");

-- CreateIndex
CREATE UNIQUE INDEX "level_id_key" ON "level"("id");

-- CreateIndex
CREATE UNIQUE INDEX "friendship_id_key" ON "friendship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_id_key" ON "blocked"("id");

-- CreateIndex
CREATE UNIQUE INDEX "matchhistory_id_key" ON "matchhistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_id_key" ON "rooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_members_id_key" ON "rooms_members"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_members_roomid_userid_key" ON "rooms_members"("roomid", "userid");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_id_key" ON "achievements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "achieved_id_key" ON "achieved"("id");

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchhistory" ADD CONSTRAINT "matchhistory_player1_fkey" FOREIGN KEY ("player1") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchhistory" ADD CONSTRAINT "matchhistory_player2_fkey" FOREIGN KEY ("player2") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms_members" ADD CONSTRAINT "rooms_members_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms_members" ADD CONSTRAINT "rooms_members_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achieved" ADD CONSTRAINT "achieved_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achieved" ADD CONSTRAINT "achieved_achievementid_fkey" FOREIGN KEY ("achievementid") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
