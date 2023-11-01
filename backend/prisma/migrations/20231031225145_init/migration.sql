-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "Name42" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Name42_key" ON "User"("Name42");

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");
