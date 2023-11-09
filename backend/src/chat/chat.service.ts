import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService implements OnModuleInit{
  constructor (private readonly prisma : PrismaService){}
  onModuleInit() {
    console.log('hi chat service')
  }
    async getrooms() {
    
    }
}
