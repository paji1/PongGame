import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server} from 'socket.io'
import { AppService } from './app.service';




@WebSocketGateway()
export class AppGateway implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly appService: AppService)
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
