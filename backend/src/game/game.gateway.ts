import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GetCurrentUserId } from 'src/common/decorators';
import { Server } from 'socket.io'
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { EDifficulty, EMatchingType } from 'src/types.ts/game-matching.interface';
import { MatchingGameDto } from './dto/matching-dto.dto';
import { GameMatchingService } from './game-matching/game-matching.service';
import { WsValidationExeption } from './filters/ws.exception.filter';

@WebSocketGateway({transports: ['websocket']})
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(AtGuard)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto) {
		if (payload.matchingType === EMatchingType.INVITE)
			await this.inviteHandler(id, payload.invite, payload.difficulty)
		else if (payload.matchingType === EMatchingType.RANDOM)
			this.randomQueueingHandler(id, payload.difficulty)
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
			console.log(`----> Error: ${error}`)
		}
	}

	randomQueueingHandler(id: number, difficulty: EDifficulty) {
		try {
			this.matching.randomMatchingHandler(id, difficulty)
		} catch (error) {
			this.server.emit('game_error', error.message)
		}
	}
}
