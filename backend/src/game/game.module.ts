import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameMatchingService } from './game-matching/game-matching.service';
import { GameGateway } from './game.gateway';


@Module({
	imports: [PrismaModule],
	controllers: [GameController],
	providers: [GameService, GameMatchingService, GameGateway],
	
})
export class GameModule {}
