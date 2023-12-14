import { Injectable, CanActivate, ExecutionContext, Query, ArgumentsHost } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WsInRoomGuard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const inroom = this.reflect.getAllAndOverride<boolean>("inRoom", [context.getHandler(), context.getClass()]);
		const client = context.switchToWs().getClient();
		const data: ChatSocketDto = context.switchToWs().getData();
		/**
		 * user id should be handled
		 */
		console.log("tfiltrat");
		const userid = 1;
		if (typeof inroom === "undefined") return true;
		if (typeof data.Destination != "number" || Number.isNaN(data.Destination)) {
			client.emit("ChatError", "invalid data");
			return false;
		}
		const check = await this.prisma.rooms_members.findUnique({
			where: { combination: { roomid: data.Destination, userid: userid } },
		});
		console.log(check);
		if (!check) {
			client.emit("ChatError", "user not in room");
			return false;
		}
		return true;
	}
}
