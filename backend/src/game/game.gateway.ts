import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GetCurrentUserId } from 'src/common/decorators';
import { Server, Socket } from 'socket.io'
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { EDifficulty, EMatchingType } from 'src/types.ts/game-matching.interface';
import { MatchingGameDto } from './dto/matching-dto.dto';
import { GameMatchingService } from './game-matching/game-matching.service';
import { WsValidationExeption } from './filters/ws.exception.filter';
import { GameService } from './game.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AcceptGameInviteDto } from './dto/accept-game-invite.dto';
import { InviteService } from 'src/invite/invite.service';
import { actionstatus, game_modes } from '@prisma/client';
import { RejectGameInviteDto } from './dto/reject-game-invite.dto';


@WebSocketGateway({transports: ['websocket']})
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(AtGuard)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService,
		private readonly gameService: GameService,
		private readonly event: EventEmitter2,
		private readonly inviteService: InviteService,
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto, @ConnectedSocket() client: Socket) {
		if (payload.matchingType === EMatchingType.INVITE)
			await this.inviteHandler(id, payload.invite, client, payload.difficulty)
		else if (payload.matchingType === EMatchingType.RANDOM)
			await this.randomQueueingHandler(id, payload.difficulty, client.id)
		else
		{

		}
	}

	async inviteHandler(id: number, nickname: string, issuer_socket: Socket, difficulty: EDifficulty)
	{
		var notifInfo = null
		try {
			const invited = await this.matching.findIDByNickname(nickname)
			if (!invited)
				throw new Error('This opponent does not exist')
			notifInfo = await this.matching.inviteHandler(id, invited.id, difficulty)
			this.matching.newInviteQueue(notifInfo.game_id)
			this.matching.inviteQueueing(notifInfo.game_id, issuer_socket.id, notifInfo.issuer_id.id, difficulty)
			notifInfo["game_id"] = notifInfo.game_id
			notifInfo["difficulty"] = difficulty
			this.event.emit("PUSH", notifInfo.reciever_id.user42, notifInfo , "INVITES")
			this.event.emit("PUSH", notifInfo.issuer_id.user42, notifInfo , "INVITES")
			issuer_socket.emit('SUCCESSFUL_INVITE', {})
		} catch (error) {
			issuer_socket.emit('game_error', error.message)
		}
	}

	async randomQueueingHandler(id: number, difficulty: EDifficulty, socket_id: string) {
		try {
			this.matching.randomMatchingHandler(id, difficulty, socket_id)
			this.server.sockets.sockets.get(socket_id).emit('enter_queue', {})
			const len = this.matching.getQueueLength(difficulty)
			if (len >= 2)
			{
				const id1 = this.matching.getQueueContentAtIndex(0, difficulty)
				const id2 = this.matching.getQueueContentAtIndex(1, difficulty)
				const sock1 = this.server.sockets.sockets.get(id1.socket_id)
				const sock2 = this.server.sockets.sockets.get(id2.socket_id)
				if (!sock1)
				{
					this.matching.leaveQueue(id1.id)
					this.randomQueueingHandler(id2.id, difficulty, id2.socket_id)
					return 
				}
				if (!sock2)
				{
					this.matching.leaveQueue(id2.id)
					this.randomQueueingHandler(id1.id, difficulty, id1.socket_id)
					return 
				}
				const room_id = `${Date.now().toString()}`
				this.start_game(room_id, sock1, sock2, id1.id, id2.id, difficulty)
				const err = new Error('Failed to create new game');
				err["room"] = room_id
			}
		} catch (error) {
			if (error.room != undefined)
				this.server.to(error.room).emit('game_error', error.message)
			else
				this.server.sockets.sockets.get(socket_id).emit('game_error', error.message)

		}
	}

	@SubscribeMessage('leave_queue') 
	leaveQueue (@GetCurrentUserId() id: number) 
	{
		this.matching.leaveQueue(id)
	}

	@SubscribeMessage('ACCEPT_GAME_INVITE') 
	async acceptGameInvite(@MessageBody() payload: AcceptGameInviteDto, @ConnectedSocket() client: Socket) 
	{
		try {
			let acceptence = null
			try {
				acceptence = await this.inviteService.updateGameInvite(payload.receiver_id, payload.invite_id, actionstatus.accepted, payload.game_id)
			} catch (error) {
				throw new Error(`Inviting error`)
			}
			this.matching.inviteQueueing(payload.game_id, client.id, payload.receiver_id, payload.game_mode)
			const reciever = this.server.sockets.sockets.get(client.id)
			if (!reciever)
				throw new Error(`Invite error: the invited user is no longer available`)
			const cuurentQueue = this.matching.isInQueue(payload.issuer_id)
			if (!cuurentQueue)
				throw new Error(`Error`);
			const issuer_socket_id = this.matching.getUserSocketInQueue(payload.issuer_id, cuurentQueue)
			if (!issuer_socket_id)
				throw new Error(`This user is no longer available`);
			const issuer = this.server.sockets.sockets.get(issuer_socket_id)
			if (!issuer)
				throw new Error(`This user is no longer available`);
			acceptence['game_id'] = payload.game_id
			this.event.emit("PUSH", acceptence.reciever_id.user42, acceptence, "INVITES")
			this.event.emit("PUSH", acceptence.issuer_id.user42, acceptence, "INVITES")
			this.start_game(payload.game_id, issuer, reciever, payload.issuer_id, payload.receiver_id, payload.game_mode)
		} catch (error) {
			client.emit('FEEDBACK_ERROR', error.message)
		} 
	}

	@SubscribeMessage('REJECT_GAME_INVITE')
	async rejectGameInvite(@MessageBody() payload: RejectGameInviteDto, @ConnectedSocket() client: Socket)
	{
		try {
			let rejection = null;
			try {
				rejection = await this.inviteService.updateGameInvite(payload.reciever_id, payload.id, actionstatus.refused, payload.game_id)
			} catch (error) {
				throw new Error(`Inviting error`)
			}
			this.event.emit("PUSH", rejection.reciever_id.user42, rejection, "INVITES")
			this.event.emit("PUSH", rejection.issuer_id.user42, rejection, "INVITES")
			const curentQueue = this.matching.isInQueue(payload.issuer_id)
			if (!curentQueue)
				throw new Error(`The user is no longer available`);
			const issuer_socket_id = this.matching.getUserSocketInQueue(payload.issuer_id, curentQueue)
			if (!issuer_socket_id)
				throw new Error(`This user is no longer available`);
			this.server.to(issuer_socket_id).emit('GAME_INVITE_REFUSED', {})
			this.matching.leaveQueue(payload.issuer_id)
		} catch (error) {
			client.emit('FEEDBACK_ERROR', error.message)
		}
	}

	async start_game(game_id: string, user1: Socket, user2: Socket, user1_id: number, user2_id: number, difficulty: game_modes) {
		this.matching.leaveQueue(user1_id)
		this.matching.leaveQueue(user2_id)
		user1.join(game_id)
		user2.join(game_id)
		const new_game = await this.gameService.create({
			id: game_id,
			game_mode: difficulty,
			player1: user1_id,
			player2: user2_id,
		})
		if (!new_game)
			throw new Error('Failed to create new game')
		this.server.to(game_id).emit('start_game', {game_id, user1_id, user2_id, difficulty})
	}
}
