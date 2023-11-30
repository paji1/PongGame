import { Injectable, CanActivate, ExecutionContext, Query } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { user_permission, roomtype } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomGuard implements CanActivate {
    constructor(private reflect: Reflector, private readonly prisma: PrismaService){
    }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const room = +(request.query['room']);
        console.log(room)
        if(Number.isNaN(room))
            return false
        const escape  = this.reflect.getAllAndOverride<boolean>('Escape', [context.getHandler(),context.getClass()])
        const roomtypes  = this.reflect.getAllAndOverride<roomtype[]>('RoomType', [context.getHandler(),context.getClass()])
        const roompermition = this.reflect.getAllAndOverride<user_permission[]>('RoomPermitions', [context.getHandler(),context.getClass()])
        if (escape)
            return true
        const user = 1;
        const membership = await this.prisma.rooms_members.findUnique({where: {combination :{roomid: room,userid: user}},select: {permission: true,rooms: {select : {roomtypeof: true}}},})
        console.log(membership)
        if (!membership)
            return false
        if (typeof roomtypes !== "undefined" && !roomtypes.includes(membership.rooms.roomtypeof))
            return false;
        if (typeof roompermition !== "undefined" && !roompermition.includes(membership.permission))
            return false;
        return true
    }
}