import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";
import { GameModule } from './game/game.module';

@Module({
	imports: [PrismaModule, ChatModule, GameModule],
	providers: [AppGateway],
})
export class AppModule {}
