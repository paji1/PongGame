import { Injectable, CanActivate, ExecutionContext, Query } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { JwtPayloadWithRt } from "src/auth/types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomGuard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflect.getAllAndOverride("isPublic", [context.getHandler(), context.getClass()]);
		if (isPublic) return true;
		const request = context.switchToHttp().getRequest();
		const room = +request.query["room"];
		const roomtypes = this.reflect.getAllAndOverride<roomtype[]>("RoomType", [
			context.getHandler(),
			context.getClass(),
		]);

		const roompermition = this.reflect.getAllAndOverride<user_permission[]>("RoomPermitions", [
			context.getHandler(),
			context.getClass(),
		]);
		const key : keyof JwtPayloadWithRt | undefined = "sub";
		var user =  request.user[key];
		if (user == undefined)
		return false
	if (typeof roomtypes !== "undefined") {
		if (Number.isNaN(room)) return false;
		const roomdata = await this.prisma.rooms.findUnique({
			where: { id: room },
		});
		if (!roomdata) return false;
		if (!roomtypes.includes(roomdata.roomtypeof)) return false;
	}
	if (typeof roompermition !== "undefined") {
		if (Number.isNaN(room)) return false;
		const membership = await this.prisma.rooms_members.findUnique({
			where: { combination: { roomid: room, userid: user } },
		});
		if (!membership) return false;
		if (!roompermition.includes(membership.permission)) return false;
		}
		return true;
	}
}
