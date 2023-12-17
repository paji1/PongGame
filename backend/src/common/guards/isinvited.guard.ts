import { Injectable, CanActivate, ExecutionContext, Query } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class Invite implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const invitation = +request.query["invite_id"];
		const invitemeta = this.reflect.getAllAndOverride<boolean>("Invite", [
			context.getHandler(),
			context.getClass(),
		]);
		console.log("at isinviteguard")

		if (typeof invitemeta === "undefined") return true;
		if (typeof invitation === "undefined") return false;
		const entry = await this.prisma.invites.findUnique({
			where: {
				id: invitation,
			},
		});
		let user = 1;
		if (!entry) return false;
		if (entry.reciever !== user) return true;
		return false;
	}
}
