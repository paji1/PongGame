import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService)
    {}
    
    async joinRoom( pid,rid)
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
    async createRoom(id)
    {
        let rp: permission = "private"
        let rmp: participation_type = "owner"
      
        let room = {
            name :  "ala azabi mat9olhachi",
            roompassword: "pass",
            roomtypeof: rp,
        }
        const re = await this.prisma.$transaction(async (trx) => {
            const newroom = await  trx.rooms.create({data: room})
            const membership = await trx.rooms_members.create({data: {
                roomid: newroom.id,
                userid: id,
                permission: rmp
            }})
        })
        
        return re
    }

    async muteParticipant(pid, tid, rid, period)
    {
      const particip : participation_type = participation_type.participation;

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(rid) }, {userid : Number(pid)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission == particip)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.updateMany(
          {
            where: {
              roomid: rid,
              userid: tid

            },
            data : {
              ismuted:true,
              muting_period: period,
              muted_at: new Date()
            }
          }
        )
      return change;
    }
    async blockUser(pid, tid, rid) {
      const particip : participation_type = participation_type.participation;

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(rid) }, {userid : Number(pid)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission == particip)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.updateMany(
          {
            where: {
              roomid: rid,
              userid: tid

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


