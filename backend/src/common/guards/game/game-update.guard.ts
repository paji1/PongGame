import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { game_state } from '@prisma/client';
import { GameService } from 'src/game/game.service';

@Injectable()
export class GameUpdateGuard implements CanActivate {

	constructor(private readonly gameService: GameService) { }

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
        const gameID = request.params.id
		const gameState = request.params.game_state
		const game = await this.gameService.findOne(gameID)
		if (!game)
			return false
		if (game.state === game_state.PENDING && gameState !== game_state.IN_PLAY)
			return false
		if (game.state === game_state.IN_PLAY && gameState !== game_state.FINISHED)
			return false
		if (game.state === game_state.FINISHED)
			return false
		return true
	}
}
