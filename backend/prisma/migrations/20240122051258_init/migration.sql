-- DropForeignKey
ALTER TABLE "achieved" DROP CONSTRAINT "achieved_userid_fkey";

-- AddForeignKey
ALTER TABLE "achieved" ADD CONSTRAINT "achieved_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
