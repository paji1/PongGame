import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
	exports: [MessagesService],
	providers: [MessagesService],
	imports: [PrismaModule],
})
export class MessagesModule {}
