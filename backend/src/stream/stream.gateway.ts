import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server} from 'socket.io'
import { PrismaService } from 'src/prisma/prisma.service';



@WebSocketGateway()
export class StreamGateway implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly PrismaService: PrismaService)
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
    console.log(message);
  }

}
