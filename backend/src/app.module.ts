import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
  providers: [AppGateway],
})
export class AppModule {}
