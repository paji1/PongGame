import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";
import { UsersService } from "./users/users.service";
import { UsersModule } from "./users/users.module";
import { AtGuard } from "./common/guards";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { GameModule } from "./game/game.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ChatModule, AuthModule, UsersModule],

	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
		AppGateway,
	],
})
export class AppModule {}
