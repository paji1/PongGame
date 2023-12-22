import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EDifficulty, IInviting } from 'src/types.ts/game-matching.interface';
import { CreateGameInviteDto } from '../dto/create-game-invite.dto';
import { actionstatus, invitetype } from '@prisma/client';

@Injectable()
export class GameMatchingService {

	private readonly queues: Map<string, number[]>

	constructor(
		readonly prisma: PrismaService,
	) {
		this.queues = new Map<string, number[]>()
		this.queues.set(EDifficulty.EASY, [])
		this.queues.set(EDifficulty.MEDIUM, [])
		this.queues.set(EDifficulty.HARD, [])
	}


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
			throw new Error(`Invite error: Make sure  ${nickname}`)
		if (inviting[0].user1_id === inviting[0].user2_id)
			throw new Error(`Invalid invite`)
		if (inviting[0].user2_nickname !== nickname)
			throw new Error(`You are unauthorized to send a game invite to ${nickname}`)
		return inviting[0]
	}

	async createInvite(invite: CreateGameInviteDto)
	{
		try {
			return await this.prisma.invites.create({
				data: {
					status: invite.status,
					type: invite.type,
					reciever: invite.reciever,
					issuer: invite.issuer,
					game_mode: invite.game_mode
				}
			})
		} catch (error) {
			throw new Error(`Something went wrong when trying to invite the user`)
		}
		
	}
	
	async isInvitationPending(userID1: number, userID2: number)
	{
		try {
			return await this.prisma.invites.findFirst({
				where: {
					AND: {
						status: actionstatus.pending,
						OR: [
							{issuer: userID1, reciever: userID2},
							{issuer: userID2, reciever: userID1}
						]
					}
				}
			})
		} catch (error) {
			return null
		}
	}

	async inviteHandler(id: number, nickname: string, difficulty: EDifficulty) {
		try {
			const inviting: IInviting | null = await this.findFriendByUsername(id, nickname)
			const newNotif: CreateGameInviteDto = {
				issuer: inviting.user1_id,
				reciever: inviting.user2_id,
				status: actionstatus.pending,
				game_mode: difficulty,
				type: invitetype.Game
			}
			const isNewInvite = await this.isInvitationPending(inviting.user2_id, inviting.user1_id)
			if (!isNewInvite)
				throw new Error(`This user is already invited`)
			//TODO: Handle accept / refuse
			this.createInvite(newNotif)
			
		} catch (error) {
			throw new Error(`${error.message}`)
		}
	}

	addToQueue(id: number, difficulty: string)
	{
		const queue = this.queues.get(difficulty)
		if (!queue)
			throw new Error(`Invalid queuing system: ${difficulty}`)
		queue.push(id)
	}

	randomMatchingHandler(id: number, difficulty: EDifficulty) {
		let isInQueue = 0
		this.queues.forEach(queue => {
			if (queue.includes(id))
			{
				isInQueue++
				return
			}
		})
		if (isInQueue)
			throw new Error(`You are already in the queue`)
		try {
			this.addToQueue(id, difficulty)
		} catch (error) {
			throw new Error(error.message)
		}
	}

}
