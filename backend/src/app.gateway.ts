import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server} from 'socket.io'
import { PrismaService } from './prisma/prisma.service';
import { ChatService } from './chat/chat.service';




@WebSocketGateway()
export class AppGateway implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prisma: PrismaService, private readonly chat : ChatService)
  {}

  @WebSocketServer()
   server: Server;
  
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('conected')
    })
  }
  onModuleDestroy() {
    
  }
  @SubscribeMessage('chat')
  onMessage(@MessageBody() message: any){

  }

}
