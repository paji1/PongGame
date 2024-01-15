import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedHistory = async () => {
	let score1 = 3;
	let score2 = 1;
	let id2 = 1;
	for(let i = 1; i <=52; i++)
	{
		score1++,score2++,id2++;
		await prisma.matchhistory.create({
			data: {
				id: Date.now().toString(),
				player1:14,
				player2:id2,
				score1:score1,
				score2:score2,
				winner_id:14,
				loser_id:id2,
				mode:"EASY",
				state: "FINISHED",
			},
		});
	}
}

(async() => {
    await prisma.$connect();
    await seedHistory();
    await prisma.$disconnect();
})()