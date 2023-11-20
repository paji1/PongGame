import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "./rooms/rooms.service";
import { MessagesService } from "./messages/messages.service";

@Injectable()
export class ChatService {
	constructor(
		public readonly messages: MessagesService,
		public readonly rooms: RoomsService,
	) {}
}
