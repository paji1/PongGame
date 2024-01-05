import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { Console } from "console";
import { JwtPayloadWithRt } from "src/auth/types";
import { PrismaService } from "src/prisma/prisma.service";
import { Roomstattypes } from "src/types.ts/statustype";

@Injectable()
export class RoomGuard implements CanActivate {
	constructor(
		private reflect: Reflector,
		private readonly prisma: PrismaService,
	) {}
	async canActivate(context: ExecutionContext) {
		
        const reqType = context.getType();
		const types = this.reflect.getAllAndOverride<roomtype[]>("RoomType", [
            context.getHandler(),
			context.getClass(),
		]);
		const Perms = this.reflect.getAllAndOverride<user_permission[]>("RoomPermitions", [
            context.getHandler(),
			context.getClass(),
		]);
        const userState = this.reflect.getAllAndOverride<Roomstattypes[]>("RoomStatus", [
            context.getHandler(),
			context.getClass(),
		]);
        const key : keyof JwtPayloadWithRt | undefined = "sub";
        var request = context.switchToHttp().getRequest();

        const UserId = request.user[key];
        const key2 : keyof JwtPayloadWithRt | undefined = "user42";

        var roomid;
        if (reqType === "ws")
        {
            context.switchToWs().getClient().request.headers["user"] = request.user[key2];
            roomid = context.switchToWs().getData().room;
            console.log(context.switchToWs().getData())
        }
        else
            roomid = +request.query["room"]
        console.log("room guard debug: <<", request.user, reqType, roomid ,">>")


        if (typeof types !== "undefined")
        {
            
                if (Number.isNaN(roomid))
                    return false;
                const frdbroom = await this.prisma.rooms.findUnique({where: { id: roomid },});
                console.log(roomid, "what")
                if (!frdbroom)
                {
                    if(reqType==="ws")
                        context.switchToWs().getClient().emit("ChatError", "room doesnt exist11")
                    else
                        throw new HttpException("room doesnt exist1", HttpStatus.BAD_REQUEST)
                    return false;
                }
                if (!types.includes(frdbroom.roomtypeof)) {
                    if(reqType==="ws")

                        context.switchToWs().getClient().emit("ChatError", "room type required is false")
                    else
                        throw new HttpException("room type required is false", HttpStatus.BAD_REQUEST)
                    return false;
                }
        }

        if (typeof Perms !== "undefined")
        {
                if (Number.isNaN(roomid)) return false;
                const membership = await this.prisma.rooms_members.findUnique({
                    where: { combination: { roomid: roomid, userid: UserId } },
                });
                if (!membership) {
                    if(reqType==="ws")
                        context.switchToWs().getClient().emit("ChatError", "room doesnt exist2")
                    else
                        throw new HttpException("room doesnt exist2", HttpStatus.BAD_REQUEST)
                return false;
                }
                if (!Perms.includes(membership.permission))
                {
                    if(reqType==="ws")
                        context.switchToWs().getClient().emit("ChatError", "room doesnt exist3")
                    else
                        throw new HttpException("room doesnt exist3", HttpStatus.BAD_REQUEST)
                    return false;
                }
                if (typeof userState !== "undefined" )
                {
                    if (membership.isblocked && userState.includes(Roomstattypes.NOTBLOCK))
                        return false
                    if (membership.isBanned && userState.includes(Roomstattypes.NOTBAN))
                        return false
                    if (membership.ismuted && userState.includes(Roomstattypes.NOTMUTE))
                        return false
                }
            }
            return true ;
	}
}
