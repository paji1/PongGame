import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';

@Module({
  exports: [ChatService],
  providers: [ChatService],
})
export class ChatModule {}
