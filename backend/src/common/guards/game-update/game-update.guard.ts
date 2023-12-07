import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { game_state } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameUpdateGuard implements CanActivate {

	constructor(private readonly prisma: PrismaService) { }

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
        const gameID = request.params.id
		const game = await this.prisma.matchhistory.findUnique({
			where: {
				id: gameID
			}
		})
		if (!game)
			return false
		if (game.state === game_state.FINISHED)
			return false
		return true
	}
}
