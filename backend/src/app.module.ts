import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AtGuard } from "./common/guards";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { InviteModule } from "./invite/invite.module";
import { AppGateway } from "./app.gateway";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { ProfileModule } from "./profile/profile.module";
import { RepositoryModule } from "./repository/repository.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		EventEmitterModule.forRoot(),
		PrismaModule,
		JwtModule.register({}),
		ChatModule,
		AuthModule,
		UsersModule,
		InviteModule,
		ProfileModule,
		RepositoryModule
	],

	providers: [
		
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
		AppGateway,
	],
})
export class AppModule {}
