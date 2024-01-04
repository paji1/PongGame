import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleAuthenticatorStrategy, intraStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { AtStrategy, RtStrategy } from "./strategy";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersService } from "src/users/users.service";

@Module({
	imports: [PrismaModule, PassportModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		AtStrategy,
		RtStrategy,
		intraStrategy,
		GoogleAuthenticatorStrategy,
		UsersService
	],
})
export class AuthModule {}
