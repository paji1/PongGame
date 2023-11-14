import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService)
    {}
    
    async joinRoom(pid, rid)
    {        
      let rmp: participation_type = "participation"
      return await this.prisma.rooms_members.create({data: {
        roomid: rid,
        userid: pid,
        permission: rmp
      }})
    }
    async getRooms(id:any)
    {
      
        const data =  await this.prisma.rooms_members.findMany({
            where: {
              userid: id,
            },
            select:{
              rooms: {
                select:{
                  rooms_members:true,
                  id:true,
                  name: true,
                  roomtypeof: true,
                  created_at: true,
                }
              }
            },
          })
          return data;
    }
    async createRoom(Requester: number, type: permission, password: string, name: string)
    {
        var participation: participation_type = participation_type.owner
        if (type == permission.chat)
          participation = participation_type.chat;

        const re = await this.prisma.$transaction(async (trx) => {
            const newroom = await  trx.rooms.create({data: {
              name: name,
              roompassword: password,
              roomtypeof: type,
          }})
            const membership = await trx.rooms_members.create({data: {
                roomid: newroom.id,
                userid: Requester,
                permission: participation
            }})
        })
        return re
    }

    async muteParticipant(Requester, targeted, roomtarget, timetomute)
    {
      const particip : participation_type = participation_type.participation;

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(roomtarget) }, {userid : Number(Requester)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission == particip)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.updateMany(
          {
            where: {
              roomid: roomtarget,
              userid: targeted

            },
            data : {
              ismuted:true,
              muting_period: timetomute,
              muted_at: new Date()
            }
          }
        )
      return change;
    }
    async blockUser(Requester, targeted, roomtarget) {
      const particip : participation_type = participation_type.participation;

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(roomtarget) }, {userid : Number(Requester)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission == particip)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.updateMany(
          {
            where: {
              roomid: roomtarget,
              userid: targeted

            },
            data : {
              isblocked:true
            }
          }
        )
      return change;
      
    }
}
import { participation_type, permission } from '@prisma/client';


