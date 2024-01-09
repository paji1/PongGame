import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedAch = async () => {

}

(async() => {
    await prisma.$connect();
    await seedAch();
    await prisma.$disconnect();
})()