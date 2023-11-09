import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  exports: [ChatService],
  providers: [ChatService],
  controllers: [ChatController],
  imports: [PrismaModule]
})
export class ChatModule {}
