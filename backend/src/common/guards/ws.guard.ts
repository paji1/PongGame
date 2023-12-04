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
		const inroom = this.reflect.getAllAndOverride<boolean>("inRoom", [
			context.getHandler(),
			context.getClass(),
		]);
        const client = context.switchToWs().getClient()
        const data: ChatSocketDto = context.switchToWs().getData()
        if (typeof inroom === "undefined")
            return true;
        if (typeof data.Destination != "number" || typeof data.Sender != "number")
        {
            client.emit("error", "zabi la")
            return false
        }
		return true;
	}
}
