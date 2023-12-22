import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GetCurrentUserId } from 'src/common/decorators';
import { Server } from 'socket.io'
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { EDifficulty, EMatchingType, IInviting, IQueue } from 'src/types.ts/game-matching.interface';
import { MatchingGameDto } from './dto/matching-dto.dto';
import { GameMatchingService } from './game-matching/game-matching.service';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import { actionstatus, invitetype } from '@prisma/client';
import { WsValidationExeption } from './filters/ws.exception.filter';

@WebSocketGateway({transports: ['websocket']})
@UseGuards(AtGuard)
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService
	) { }

	@WebSocketServer()
	server: Server

	@SubscribeMessage('matching')
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto) {
		
		if (payload.matchingType === EMatchingType.INVITE)
		{
			const test = await this.inviteHandler(id, payload.invite, payload.difficulty)
			if (!test)
				console.log(`zbi la khdmt`)
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
		try {
			const inviting: IInviting | null = await this.matching.findFriendByUsername(id, nickname)
			const newNotif: CreateGameInviteDto = {
				issuer: inviting.user1_id,
				reciever: inviting.user2_id,
				status: actionstatus.pending,
				game_mode: difficulty,
				type: invitetype.Game
			}
			const isNewInvite = await this.matching.isInvitationPending(1111, inviting.user1_id)
			if (!isNewInvite)
				throw new Error(`This user is already invited`)
			//TODO: Handle accept / refuse
			this.matching.createInvite(newNotif)
			
		} catch (error) {
			this.server.emit('game_error', error.message)
			console.log(`----> Error: ${error}`)
			return false
		}
		return true
	}

	randomQueueingHandler() {

	}
}
