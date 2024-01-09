import { Injectable, CanActivate, ExecutionContext, Query, ArgumentsHost } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { JwtPayloadWithRt } from "src/auth/types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WsInRoomGuard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflect.getAllAndOverride("isPublic", [context.getHandler(), context.getClass()]);
		if (isPublic) return true;
		const inroom = this.reflect.getAllAndOverride<boolean>("inRoom", [context.getHandler(), context.getClass()]);
		const client = context.switchToWs().getClient();
		const request = context.switchToHttp().getRequest()

		const data: ChatSocketDto = context.switchToWs().getData();
		/**
		 * user id should be handled
		 */

		const key : keyof JwtPayloadWithRt | undefined = "sub";
		var userid =  request.user["sub"];
		if (typeof userid != "number" )
			return false
		if (typeof inroom === "undefined") return true;
		console
		if (typeof data.Destination != "number" || Number.isNaN(data.Destination)) {
			client.emit("ChatError", "invalid data");
			return false;
		}
		const check = await this.prisma.rooms_members.findUnique({
			where: { combination: { roomid: data.Destination, userid: userid } },
		});
		if (!check) {
			client.emit("ChatError", "user not in room");
			return false;
		}
		return true;
	}
}
