import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserExistGuard implements CanActivate {

	constructor(private readonly prisma: PrismaService) { }

	async checkUserExists(playerID: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: playerID }
			})
			return !!user
		} catch (error) {
			return false;
		}
	}

	async verifyUsers(userID1: number, userID2: number) {
		const u1 = await this.checkUserExists(userID1)
		const u2 = await this.checkUserExists(userID2)
		return u1 && u2
	}

	async canActivate(context: ExecutionContext) {

		const request = context.switchToHttp().getRequest()
		const reqBody = request.body
		if (!request)
			return false
		const res = await this.verifyUsers(reqBody.player1, reqBody.player2)
		if (!res)
			return false
		return true;
	}
}
