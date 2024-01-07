import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersController } from './users.controller';
import { JwtService } from "@nestjs/jwt";

@Module({
	imports: [PrismaModule],
	providers: [UsersService, JwtService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
