import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AtGuard } from "./common/guards";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { InviteModule } from "./invite/invite.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ChatModule, AuthModule, UsersModule, InviteModule],

	providers: [
		
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
	],
})
export class AppModule {}
