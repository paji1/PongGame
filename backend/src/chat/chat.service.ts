import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ChatService implements OnModuleInit{
  onModuleInit() {
    console.log('hi')
  }
    getHello(): string {
        return 'Hello  chat';
      }
}
