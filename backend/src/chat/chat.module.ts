import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { RoomsService } from "./rooms/rooms.service";
import { RoomsModule } from "./rooms/rooms.module";
import { MessagesModule } from "./messages/messages.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { ChatGateway } from './chat.gateway';
import { RoomGuard } from "src/common/guards/chat/RoomGuards.guard";

@Module({
	exports: [ChatService],
	providers: [
		ChatService,
		RoomsService,
		ChatGateway
	],
	controllers: [ChatController],

	imports: [RoomsModule, MessagesModule, PrismaModule],
})
export class ChatModule {}
