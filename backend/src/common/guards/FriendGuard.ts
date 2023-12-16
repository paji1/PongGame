import { Injectable, CanActivate, ExecutionContext, Query } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { JwtPayloadWithRt } from "src/auth/types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendGuard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const friend = +request.query["friend"];
		const Guarded = this.reflect.getAllAndOverride<boolean>("Friend", [context.getHandler(), context.getClass()]);

		
		if (typeof Guarded === "undefined") return true;
		const key : keyof JwtPayloadWithRt | undefined = "sub";
		var user =  request.user[key];
		if (user == undefined)
			return false
		if (Number.isNaN(friend)) return false;
		const arefriends = await this.prisma.friendship.findFirst({
			where: {
				OR: [
					{ initiator: user, reciever: friend },
					{ initiator: friend, reciever: friend },
				],
			},
		});
		console.log(arefriends);
		if (!arefriends) return false;
		return true;
	}
}
