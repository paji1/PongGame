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

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ChatModule, AuthModule, UsersModule],

	providers: [
		AppGateway,
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
	],
})
export class AppModule {}
