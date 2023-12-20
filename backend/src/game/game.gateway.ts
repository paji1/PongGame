import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GetCurrentUserId } from 'src/common/decorators';
import { Server } from 'socket.io'
import { UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { EDifficulty, EMatchingType, IInviting, IQueue } from 'src/types.ts/game-matching.interface';
import { MatchingGameDto } from './dto/matching-dto.dto';
import { GameMatchingService } from './game-matching/game-matching.service';

@WebSocketGateway({transports: ['websocket']})
@UseGuards(AtGuard)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto) {
		
		console.log('dkhlt')
		
		if (payload.matchingType === EMatchingType.INVITE)
		{
			const test = await this.inviteHandler(id, payload.invite, payload.difficulty)
		}
		else if (payload.matchingType === EMatchingType.RANDOM)
			this.randomQueueingHandler()
		else
		{
			console.log('taqalwa')
		}
	}

	async inviteHandler(id: number, nickname: string, difficulty: EDifficulty)
	{
		const inviting: IInviting | null = await this.matching.findFriendByUsername(id, nickname)
		if (!inviting) return false
		console.log('-->', inviting)
			
	}

	randomQueueingHandler() {

	}
}
