import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GetCurrentUserId } from 'src/common/decorators';
import { Server, Socket } from 'socket.io'
import { Body, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { EDifficulty, EMatchingType } from 'src/types.ts/game-matching.interface';
import { MatchingGameDto } from './dto/matching-dto.dto';
import { GameMatchingService } from './game-matching/game-matching.service';
import { WsValidationExeption } from './filters/ws.exception.filter';
import { GameService } from './game.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AcceptGameInviteDto } from './dto/accept-game-invite.dto';
import { InviteService } from 'src/invite/invite.service';
import { actionstatus, current_state, game_modes, matchhistory } from '@prisma/client';
import { RejectGameInviteDto } from './dto/reject-game-invite.dto';
import Game from './pong-game/Game';

@WebSocketGateway({ transports: ['websocket'] })
@UsePipes(new ValidationPipe())
@UseGuards(AtGuard)
@UseFilters(WsValidationExeption)
export class GameGateway {

	constructor(
		private readonly matching: GameMatchingService,
		private readonly gameService: GameService,
		private readonly event: EventEmitter2,
		private readonly inviteService: InviteService,
	) {
		this.games = new Map<string, Game>()
	}

	@WebSocketServer()
	server: Server
	games: Map<string, Game>

	@SubscribeMessage('matching')
	// TODO: when session expires the client does not leave the queue
	async routeMatching(@GetCurrentUserId() id: number, @MessageBody() payload: MatchingGameDto, @ConnectedSocket() client: Socket) {
		const res = await this.gameService.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				connection_state: true
			}
		})

		if (res && res.connection_state === "IN_GAME")
			return
		if (payload.matchingType === EMatchingType.INVITE)
			await this.inviteHandler(id, payload.invite, client, payload.difficulty)
		else if (payload.matchingType === EMatchingType.RANDOM)
			await this.randomQueueingHandler(id, payload.difficulty, client.id)
		else {

		}
	}

	async inviteHandler(id: number, nickname: string, issuer_socket: Socket, difficulty: EDifficulty) {
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
			this.event.emit("PUSH", notifInfo.reciever_id.user42, notifInfo, "INVITES")
			this.event.emit("PUSH", notifInfo.issuer_id.user42, notifInfo, "INVITES")
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
			if (len >= 2) {
				const host = this.matching.getQueueContentAtIndex(0, difficulty)
				const guest = this.matching.getQueueContentAtIndex(1, difficulty)
				const host_socket = this.server.sockets.sockets.get(host.socket_id)
				const guest_socket = this.server.sockets.sockets.get(guest.socket_id)
				if (!host_socket) {
					this.matching.leaveQueue(host.id)
					this.randomQueueingHandler(guest.id, difficulty, guest.socket_id)
					return
				}
				if (!guest_socket) {
					this.matching.leaveQueue(guest.id)
					this.randomQueueingHandler(host.id, difficulty, host.socket_id)
					return
				}
				const room_id = `${Date.now().toString()}`
				this.start_game(room_id, host_socket, guest_socket, host.id, guest.id, difficulty)
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
	leaveQueue(@GetCurrentUserId() id: number) {
		this.matching.leaveQueue(id)
	}

	@SubscribeMessage('ACCEPT_GAME_INVITE')
	async acceptGameInvite(@MessageBody() payload: AcceptGameInviteDto, @ConnectedSocket() client: Socket) {
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
	async rejectGameInvite(@MessageBody() payload: RejectGameInviteDto, @ConnectedSocket() client: Socket) {
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
		const game = new Game(game_id, user1, user2, difficulty, user1_id, user2_id, this.event)
		this.games.set(game_id, game)
		this.server.sockets.sockets.get(user1.id).emit('start_game', {
			game_id,
			user1_id,
			user2_id,
			difficulty,
			opp: new_game.player2_id,
			is_host: true
		})
		this.server.sockets.sockets.get(user2.id).emit('start_game', {
			game_id,
			user1_id,
			user2_id,
			difficulty,
			opp: new_game.player1_id,
			is_host: false
		})
	}

	@SubscribeMessage('GAME_READY')
	game_ready(@ConnectedSocket() client: Socket, @MessageBody() payload: any) { // TODO: needs dto

		const game_id = payload.game_id
		const game = this.games.get(game_id)
		if (!game || game.game_over) return // TODO: game not started
		if (!game.isValidPlayer(client.id))
			return 
		game.number_of_players++
		if (game.number_of_players === 2) {
			game.setup()

			game.run()
		}
		else {
			// siiir qwed
		}
	}

	@SubscribeMessage('PADDLE_POSITION')
	updatePaddles(@ConnectedSocket() client, @MessageBody() payload: any) { // TODO: dto
		const game_id = payload.game_id
		const game = this.games.get(game_id)
		if (!game.isValidPlayer(client.id)) return
		if (!game || game.game_over) return // TODO: game not started
		if (!game.isValidPlayer(client.id))
			return 
		game.setRecievedPaddlePos(client.id, payload.Why)
	}

	@SubscribeMessage('LEAVE_GAME')
	left_game(@ConnectedSocket() client, @MessageBody() payload: any) {
		const game = this.games.get(payload.game_id)
		if (!game) return
		if (!game.isValidPlayer(client.id)) return
		if (!game.game_over)
			game.clientLeft(client)
	}

	@OnEvent('GAME_RESULT')
	async gameResult(game_id: string, winner_id: number, loser_id: number, host_score: number, guest_score: number) {


		const res = await this.gameService.prisma.matchhistory.update({
			where: {
				id: game_id
			},
			data: {
				loser_id: loser_id,
				winner_id: winner_id,
				state: 'FINISHED',
				score1: host_score,
				score2: guest_score
			}
		})

		const level_inc = res.mode === game_modes.EASY ? 10 : res.mode === game_modes.MEDIUM ? 20 : 30
		const res2 = await this.gameService.prisma.user.update({
			where: {
				id: winner_id,
			},
			data: {
				experience_points: {
					increment: level_inc
				},

			},
			select:
			{
				achieved: true,
				player1: true,
				player2: true

			}
		})
		try {
			let addAchieved: any = [];
			if (res2.achieved.findIndex((rr) => rr.index === 2) === -1) {
				addAchieved.push({index: 2});
			}
			if (res2.achieved.findIndex((rr) => rr.index === 4 ) === -1 ) {
				let a: matchhistory[];
				a = Array.isArray(res2.player1) ? res2.player1.filter(user => user.winner_id === winner_id): []
				a = a.concat(Array.isArray(res2.player2) ? res2.player2.filter(user => user.winner_id === winner_id) : [])
				if (a.length >= 3) {
					addAchieved.push({index: 4});
				}
			}
			if (res2.achieved.findIndex((rr) => rr.index ===5 ) === -1)
			{
				let a: matchhistory[];
					a = res2.player1
					Array.isArray(a) ? a =  a.concat( Array.isArray(res2.player2) ?  res2.player2 : []) :a = []  
					if (a.findIndex((r) => r.mode === "EASY") !== -1 && a.findIndex((r) => r.mode === "MEDIUM") !== -1  && a.findIndex((r) => r.mode === "HARD") !== -1) {
						addAchieved.push({index: 5});
				}
			}
			if ((!host_score  || !guest_score ) && res2.achieved.findIndex((rr) => rr.index === 7 ) === -1)
			{
				addAchieved.push({index: 7});
			}
	
			if (res2.achieved.findIndex((rr) => rr.index === 8 ) === -1 ) {
				let a: matchhistory[];
				a = Array.isArray(res2.player1) ? res2.player1.filter(user => user.winner_id === winner_id): []
				a = a.concat(Array.isArray(res2.player2) ? res2.player2.filter(user => user.winner_id === winner_id) : [])
				if (a.findIndex((r) => r.mode === "EASY") !== -1 && a.findIndex((r) => r.mode === "MEDIUM") !== -1  && a.findIndex((r) => r.mode === "HARD") !== -1) {
					addAchieved.push({index: 8});
				}
			}
			if ((!host_score  || !guest_score ) && (guest_score== 10 || host_score == 10) && res2.achieved.findIndex((rr) => rr.index === 9 ) === -1)
			{
				addAchieved.push({index: 9});
			}
			
			if (addAchieved.length)
			{
				await this.gameService.prisma.user.update({
					where: {
						id: winner_id
					},
					data: {
						achieved:{
							createMany:{
								data:  addAchieved
							}
						}
					}
				})
			}
			
		} catch (error) {
			
		}
		this.games.delete(game_id)
		this.event.emit("LEFT_GAME", winner_id, loser_id)
	}
}