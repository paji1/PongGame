import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EDifficulty, IInviting } from 'src/types.ts/game-matching.interface';
import { CreateGameInviteDto } from '../dto/create-game-invite.dto';
import { actionstatus, invitetype, relationsip_status } from '@prisma/client';


interface IStoredClient {
	id: number,
	socket_id: string
}


@Injectable()
export class GameMatchingService {

	private readonly queues: Map<string, IStoredClient[]>

	constructor(
		readonly prisma: PrismaService,
	) {
		this.queues = new Map<string, IStoredClient[]>()
		this.queues.set(EDifficulty.EASY, [])
		this.queues.set(EDifficulty.MEDIUM, [])
		this.queues.set(EDifficulty.HARD, [])
	}


	async findFriendByID(userID1: number, userID2: number)
	{
		const friends = await this.prisma.friendship.findFirst({
			where: {
				AND: [
					{status: relationsip_status.DEFAULT},
					{
						OR: [{
								initiator: userID1,
								reciever: userID2,
							}, {
								initiator: userID2,
								reciever: userID1
							}
						]
					}
				],
			}
		})
		return friends
	}

	async findIDByNickname(nickname: string) {
		return await this.prisma.user.findUnique({
			select: {
				id: true
			},
			where: {
				nickname
			}
		})
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
				},
				select: {
					id: true,
					status: true,
					type: true,
					reciever: true,
					issuer: true,
					game_mode: true,
					issuer_id: {
						select:
						{
							id:true,
							nickname:true,
							user42:true,
							avatar:true
						},
					},
					reciever_id: {
						select:
						{
							id:true,
							user42:true,
							nickname:true,
						}
					}
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

	async inviteHandler(id: number, invited: number, difficulty: EDifficulty) {
		try {
			const inviting = await this.findFriendByID(id, invited)
			if (!inviting)
				throw new Error(`You can only play against a friend`)
			const isNewInvite = await this.isInvitationPending(inviting.initiator, inviting.reciever)
			if (isNewInvite)
				throw new Error(`This user is already invited`)
			const newNotif: CreateGameInviteDto = {
				issuer: inviting.initiator,
				reciever: inviting.reciever,
				status: actionstatus.pending,
				game_mode: difficulty,
				type: invitetype.Game
			}
			const new_created = await this.createInvite(newNotif)
			return new_created
		} catch (error) {
			throw new Error(`${error.message}`)
		}
	}

	addToQueue(id: number, difficulty: string, socket_id: string)
	{
		const queue = this.queues.get(difficulty)
		if (!queue)
			throw new Error(`Invalid queuing system: ${difficulty}`)
		queue.push({id, socket_id})
	}

	isInQueue(id: number): EDifficulty | null {
		const difficulties = [EDifficulty.EASY, EDifficulty.MEDIUM, EDifficulty.HARD];
		
		for (const difficulty of difficulties) {
			if (this.queues.get(difficulty).find(queue => queue.id === id))
				return difficulty
		}
		return null;
	}

	leaveQueue(id: number) {
		const found = this.isInQueue(id)
		if (!found)
			return
		const queue = this.queues.get(found)
		const index = queue.findIndex(queue => queue.id === id)
		if (index !== -1)
			queue.splice(index, 1);
	}

	randomMatchingHandler(id: number, difficulty: EDifficulty, socket_id: string) {
		const found = this.isInQueue(id)
		if (found)
			throw new Error(`You are already in the queue`)
		try {
			this.addToQueue(id, difficulty, socket_id)
		} catch (error) {
			throw new Error(error.message)
		}
	}

	getQueueLength(difficulty: string): number {
		const queue = this.queues.get(difficulty)
		if (!queue)
			throw new Error(`Invalid queuing system: ${difficulty}`)
		return queue.length
	}

	getQueueContentAtIndex(index: number, difficulty: string)
	{
		const queue = this.queues.get(difficulty)
		if (!queue)
			throw new Error(`Invalid queuing system: ${difficulty}`)
		if (index < 0 || index >= queue.length)
			throw new Error(`Queueing Error`)
		return queue[index]
	}

	newInviteQueue(game_id: string) {
		this.queues.set(game_id, [])
	}

	inviteQueueing(game_id: string, socket_id: string, player_id: number) {
		let queue = this.queues.get(game_id)
		if (!queue)
			throw new Error(`Invalid queueing system`)
		if (queue.length > 2)
			throw new Error(`Invalid invitation`)
		queue.push({id: player_id, socket_id})
	}
}
