import { Injectable, CanActivate, ExecutionContext, Query, ArgumentsHost } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WsSecureguard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const client = context.switchToWs().getClient();
		const data: ChatSocketDto = context.switchToWs().getData();
		/**
		 * user id should be handled
		 */
		console.log("socket zaaaaaaaaabiio");
	
		return true;
	}
}
