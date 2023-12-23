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

@WebSocketGateway({transports: ['websocket']})
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(AtGuard)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService,
		private readonly gameService: GameService
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto, @ConnectedSocket() client: Socket) {
		if (payload.matchingType === EMatchingType.INVITE)
			await this.inviteHandler(id, payload.invite, payload.difficulty)
		else if (payload.matchingType === EMatchingType.RANDOM)
			await this.randomQueueingHandler(id, payload.difficulty, client.id)
		else
		{
			console.log('taqalwa')
		}
	}

	async inviteHandler(id: number, nickname: string, difficulty: EDifficulty)
	{
		try { 
			this.matching.inviteHandler(id, nickname, difficulty)
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
				console.log(`start queue...`)
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
				sock1.join(room_id)
				sock2.join(room_id)
				const err = new Error('Failed to create new game');
				err["room"] = room_id
				if (!test)
					throw new Error('Failed to create new game')
				this.server.to(room_id).emit('start_game', {})
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

	start_game() {

	}
}
