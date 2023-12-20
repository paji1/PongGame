import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IInviting } from 'src/types.ts/game-matching.interface';

@Injectable()
export class GameMatchingService {

	constructor(readonly prisma: PrismaService) { }


	async findFriendByUsername(userID: number, nickname: string): Promise<IInviting | null>
	{
		const inviting: IInviting[] = await this.prisma.$queryRaw`SELECT
			u1.id AS user1_id,
			u1.nickname AS user1_nickname,
			u2.id AS user2_id,
			u2.nickname AS user2_nickname
		FROM
			(SELECT * FROM "user" WHERE "id" = ${userID}) u1
		JOIN
			"friendship" f ON (u1.id = f.initiator OR u1.id = f.reciever)
		JOIN
			"user" u2 ON (u2.nickname = ${nickname} AND (u2.id = f.reciever OR u2.id = f.initiator))
		`
		if (inviting.length !== 2)
			return null
		if (inviting[0].user1_id === inviting[0].user2_id)
			return null
		if (inviting[0].user2_nickname !== nickname)
			return null
		return inviting[0]
	}


	

	async inviteHandler() {

	}

	async randomeHandler() {

	}

}
