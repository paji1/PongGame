import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService implements OnModuleInit{
  constructor (private readonly prisma : PrismaService){}
  onModuleInit() {
    console.log('hi chat service')
  }
    async getrooms() {
      const room = await this.prisma.room_particiants.findMany({
        where:{
          user_id: 7
        },
        select:{
          rooms:true
        }
      })
      return room;
    }
}
