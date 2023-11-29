import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [PrismaModule]
})
export class GameModule {}
