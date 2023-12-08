import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameLogicService } from './game-logic/game-logic.service';

@Module({
	imports: [PrismaModule],
	controllers: [GameController],
	providers: [GameService, GameLogicService],
})
export class GameModule {}
