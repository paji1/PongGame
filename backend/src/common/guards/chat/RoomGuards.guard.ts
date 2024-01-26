import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EventEmitter2 } from "@nestjs/event-emitter";
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
        private readonly events: EventEmitter2
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

        var roomid ;
        if (reqType === "ws")
        {
            context.switchToWs().getClient().request.headers["user"] = request.user[key2];
            roomid = +context.switchToWs().getData().room;
        }
        else
            roomid = +request.query["room"]

        const now = new Date()
        if (typeof types !== "undefined")
        {
            
                if (Number.isNaN(roomid))
                {
                    context.switchToWs().getClient().emit("ChatError", "wrong id")
                    return false;
                }
                const frdbroom = await this.prisma.rooms.findUnique({where: { id: roomid },});
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
                    {
                        return false
                    }
                    if (membership.isBanned && userState.includes(Roomstattypes.NOTBAN) && Object.keys(context.switchToWs().getData()).length > 1)
                    {
                        if(reqType==="ws")
                            context.switchToWs().getClient().emit("ChatError", "your banned from thi room")
                        return false
                    }
                    if (membership.ismuted && userState.includes(Roomstattypes.NOTMUTE))
                    {
                        if (((new Date()).getTime() - membership.mutetime.getTime() - 60000) > 0)
                        {
                            const newres = await this.prisma.rooms_members.update({where:{id: membership.id},data: {ismuted:false, mutetime:null}, select: {
                                id: true,
                                roomid: true,
                                permission: true,
                                isblocked: true,
                                isBanned: true,
                                ismuted: true,
                                created_at: true,
                                user_id: {
                                    select: {
                                        id: true,
                                        nickname: true,
                                        avatar: true,
                                    },
                                },
                            },})
                            this.events.emit("AUTOUNMUTE", membership.roomid, newres);
                            return true;
                        }
                        if(reqType==="ws")
                            context.switchToWs().getClient().emit("ChatError", "you are muted")
                        return false
                    }
                }
            }
            return true ;
	}
}
