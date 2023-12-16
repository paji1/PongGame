import {
	OnModuleDestroy,
	OnModuleInit,
	SetMetadata,
	UseFilters,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatService } from "./chat/chat.service";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { WsValidationExeption } from "src/common/filters/ws.exeption.filter";
import { WsInRoomGuard } from "src/common/guards/ws.guard";
import { inRoom } from "src/common/decorators/wsinRoom.decorator";
import { AdjacencyList } from "./common/classes/adjacent";
import { subscribe } from "diagnostics_channel";
import { stat } from "fs";
import { action, statusDto } from "./Dto/status.dto";
import { AtGuard } from "./common/guards";
import { WsSecureguard } from "./common/guards/WsSecureguard.guard";
import { GetCurrentUserId } from "./common/decorators";

@WebSocketGateway({ transports: ["websocket"] })
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(WsInRoomGuard)
@UseGuards(AtGuard)

export class AppGateway  {
	constructor(
		private readonly prisma: PrismaService,
		private readonly chat: ChatService,
	) {
	}

	@WebSocketServer()
	server: Server;
	id: string;


	async handleConnection(client , ) {
		// console.log(`Client connecter ${client.id}`);
		console.log(client.request.headers)

		const user_rooms = await this.getRooms(1);
		for (let i = 0; i < user_rooms.length; i++) {
			client.join(user_rooms[i].rooms.id.toString());
		}
	}
	handleDisconnect(client) {
		console.log(`Client disconnected ${client.id}`);
	}
	@SubscribeMessage("chat")
	@inRoom()
	async onMessage(@ConnectedSocket() client, @MessageBody() message: ChatSocketDto, @GetCurrentUserId() id:number) {
		console.log(id, "number");

		const res = await this.prisma.$transaction(async (trx) => {
			const msgid = await trx.messages.create({
				data: { sender_id: 1, room_id: message.Destination, messages: message.Message },
			});
			await trx.rooms.update({ where: { id: message.Destination }, data: { updated_at: msgid.created_at } });
			return await trx.messages.findUnique({
				where: { id: msgid.id },
				select: {
					created_at: true,
					room_id: true,
					messages: true,
					senderid: { select: { id: true, nickname: true, avatar: true } },
				},
			});
		});
		if (res) this.server.to(message.Destination.toString()).emit("chat", res);
		else client.emit("ChatError", "error sending message");
	}
	
	async getRooms(user) {
		const data = await this.prisma.rooms_members.findMany({
			where: {
				userid: user,
			},
			select: {
				rooms: {
					select: {
						id: true,
					},
				},
			},
		});
		return data;
	}
}
