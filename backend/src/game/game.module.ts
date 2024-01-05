import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameMatchingService } from './game-matching/game-matching.service';
import { GameGateway } from './game.gateway';
import { InviteModule } from 'src/invite/invite.module';


@Module({
	imports: [PrismaModule, InviteModule],
	controllers: [GameController],
	providers: [GameService, GameMatchingService, GameGateway],
	
})
export class GameModule {}
