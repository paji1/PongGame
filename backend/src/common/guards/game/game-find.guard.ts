import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GameService } from 'src/game/game.service';

@Injectable()
export class GameFindGuard implements CanActivate {

	constructor (private readonly gameService: GameService) { }
	
	async canActivate(context: ExecutionContext) {

		const request = context.switchToHttp().getRequest()
		const gameID = request.params.id
		const game = this.gameService.findOne(gameID)
		return game ? true : false

	}
}
