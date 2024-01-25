-- DropForeignKey
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_initiator_fkey";

-- DropForeignKey
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_reciever_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_issuer_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_reciever_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_room_fkey";

-- DropForeignKey
ALTER TABLE "matchhistory" DROP CONSTRAINT "matchhistory_player1_fkey";

-- DropForeignKey
ALTER TABLE "matchhistory" DROP CONSTRAINT "matchhistory_player2_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms_members" DROP CONSTRAINT "rooms_members_userid_fkey";

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchhistory" ADD CONSTRAINT "matchhistory_player1_fkey" FOREIGN KEY ("player1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchhistory" ADD CONSTRAINT "matchhistory_player2_fkey" FOREIGN KEY ("player2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms_members" ADD CONSTRAINT "rooms_members_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_issuer_fkey" FOREIGN KEY ("issuer") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_room_fkey" FOREIGN KEY ("room") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
