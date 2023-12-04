import { OnModuleDestroy, OnModuleInit, SetMetadata, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "./prisma/prisma.service";
import { ChatService } from "./chat/chat.service";
import { ChatSocketDto } from "./Dto/ChatSocketFormat.dto";
import { WsValidationExeption } from "./filters/ws.exeption.filter";
import { WsInRoomGuard } from "./common/guards/ws.guard";
import { inRoom } from "./common/decorators/wsinRoom.decorator";

@WebSocketGateway({ transports: ['websocket'] })
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(WsInRoomGuard)
export class AppGateway implements OnModuleInit, OnModuleDestroy {
	constructor(
		private readonly prisma: PrismaService,
		private readonly chat: ChatService,
	) {
		this.map = new Map<string, string>
	}
	
	@WebSocketServer()
	server: Server;
	map : Map<string, string>;
	onModuleInit() {
		this.server.on("connection", (socket) => {
			console.log(socket.request.headers);
			console.log(socket.id);
			console.log("conected");
			this.map.set(socket.id, "salam" )
		});
	}
	onModuleDestroy() {}
	@SubscribeMessage("chat")
	@inRoom()
	onMessage(@MessageBody() message: ChatSocketDto)
	{
		console.log(message)
		this.map.set("mes", "mm")
		console.log( this.map)
	}
	
}
