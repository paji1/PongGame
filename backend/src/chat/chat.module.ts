import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { RoomsService } from "./rooms/rooms.service";
import { RoomsModule } from "./rooms/rooms.module";
import { MessagesModule } from "./messages/messages.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomGuard } from "src/common/guards/RoomGuard";
import { APP_GUARD } from "@nestjs/core";
import { FriendGuard } from "src/common/guards/FriendGuard";

@Module({
	exports: [ChatService],
	providers: [ChatService, RoomsService,
	{
		provide:APP_GUARD,
		useClass: RoomGuard
	},
	{
		provide:APP_GUARD,
		useClass: FriendGuard
	}
],
	controllers: [ChatController],

	imports: [RoomsModule, MessagesModule, PrismaModule],
})
export class ChatModule {}
