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


@WebSocketGateway({transports: ['websocket']})
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(AtGuard)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService,
		private readonly gameService: GameService,
		private readonly event: EventEmitter2
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto, @ConnectedSocket() client: Socket) {
		if (payload.matchingType === EMatchingType.INVITE)
			await this.inviteHandler(id, payload.invite, client.id, payload.difficulty)
		else if (payload.matchingType === EMatchingType.RANDOM)
			await this.randomQueueingHandler(id, payload.difficulty, client.id)
		else
		{

		}
	}

	async inviteHandler(id: number, nickname: string, socket_id: string, difficulty: EDifficulty)
	{
		try {
			const issuer_socket = this.server.sockets.sockets.get(socket_id)
			if (!issuer_socket)
				return // TODO: issuer is no longer available
			const invited = await this.matching.findIDByNickname(nickname)
			if (!invited)
				throw new Error('This opponent does not exist')
			const notifInfo = await this.matching.inviteHandler(id, invited.id, difficulty)
			const game_id = Date.now().toString()
			this.matching.newInviteQueue(game_id)
			this.matching.inviteQueueing(game_id, socket_id, notifInfo.issuer_id.id)
			notifInfo["game_id"] = game_id
			notifInfo["difficulty"] = difficulty
			this.event.emit("PUSH", notifInfo.reciever_id.user42, notifInfo , "INVITES")
			issuer_socket.emit('SUCCESSFUL_INVITE', {})
		} catch (error) {
			this.server.emit('game_error', error.message)
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
				this.matching.leaveQueue(id1.id)
				this.matching.leaveQueue(id2.id)
				const room_id = `${id1.id}_${id2.id}_${Date.now().toString()}`

				const test = await this.gameService.create({
					id: room_id,
					game_mode: difficulty,
					player1: id1.id,
					player2: id2.id,
				})
				if (!test)
					throw new Error('Failed to create new game')
				this.start_game(room_id, sock1, sock2)
				const err = new Error('Failed to create new game');
				err["room"] = room_id
				// this.server.to(room_id).emit('start_game', {})
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
			this.matching.inviteQueueing(payload.game_id, client.id, payload.reciever_id)
			const new_game = await this.gameService.create({
				id: payload.game_id,
				player1: payload.issuer_id,
				player2: payload.reciever_id,
				game_mode: payload.game_mode
			})
			const reciever = this.server.sockets.sockets.get(client.id)
			if (!reciever)
				throw new Error(`Invite error: the invited user is no longer available`)
			const issuer = this.server.sockets.sockets.get(payload.issuer_socket_id)
			if (!issuer)
				throw new Error(`Invite error: the issuer user is no longer available`)
			this.start_game(payload.game_id, issuer, reciever)
		} catch (error) {
			client.emit('INVITE_ERROR', error.message)
		}
	}

	start_game(room_id: string, user1: Socket, user2: Socket) {
		user1.join(room_id)
		user2.join(room_id)
		this.server.to(room_id).emit('start_game', {})
	}
}
