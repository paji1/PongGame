import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService)
    {}
    
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
}
import { participation_type, permission } from '@prisma/client';


