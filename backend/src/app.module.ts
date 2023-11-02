import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
