import { OnModuleDestroy, OnModuleInit, SetMetadata, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatService } from "./chat.service";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { WsValidationExeption } from "src/common/filters/ws.exeption.filter";
import { WsInRoomGuard } from "src/common/guards/ws.guard";
import { inRoom } from "src/common/decorators/wsinRoom.decorator";

@WebSocketGateway( {namespace: 'chat' , transports: ['websocket'] })
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(WsInRoomGuard)
export class ChatGateway implements OnModuleInit, OnModuleDestroy {
	 constructor(
		private readonly prisma: PrismaService,
		private readonly chat: ChatService,
	) {
		this.map = new Map<string, number>
		
	}
	
	@WebSocketServer()
	server: Server;
	map : Map<string, number>;
	rooms: any;
	async onModuleInit() {
		await this.updaterooms()
	}
	onModuleDestroy() {}
	handleConnection(client){
		console.log(`Client connecter ${client.id}`)
		this.getRooms(1);
	}
	handleDisconnect(client){
		console.log(`Client disconnected ${client.id}`)
	}
	@SubscribeMessage("chat")
	@inRoom()
	onMessage(@MessageBody() message: ChatSocketDto)
	{
		console.log(message)
		this.map.set("mes", 22)
		console.log( this.map)
	}
	async getRooms(user)
	{
			const data = await this.prisma.rooms_members.findMany({
				where:
				{
					userid: user,
				},
				select:{
					rooms:
					{
						select: {
							id:true,
						}
					}
				}});
				console.log(data)
				return data;

	}
	async updaterooms() {
		this.rooms = await await this.prisma.rooms.findMany({select:{id: true}});
		console.log(this.rooms)
	}
}
