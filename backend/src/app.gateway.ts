import { OnModuleDestroy, OnModuleInit, SetMetadata, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatService } from "./chat/chat.service";
import { ChatSocketDto } from "src/Dto/ChatSocketFormat.dto";
import { WsValidationExeption } from "src/common/filters/ws.exeption.filter";
import { WsInRoomGuard } from "src/common/guards/ws.guard";
import { inRoom } from "src/common/decorators/wsinRoom.decorator";

@WebSocketGateway({transports: ['websocket'] })
@UsePipes(new ValidationPipe())
@UseFilters(WsValidationExeption)
@UseGuards(WsInRoomGuard)
export class AppGateway implements OnModuleInit, OnModuleDestroy {
	 constructor(
		private readonly prisma: PrismaService,
		private readonly chat: ChatService,
	) {
		this.map = new Map<string, number>
	}
	
	@WebSocketServer()
		server: Server;
		map : Map<string, number>;
	onModuleInit() {}
	onModuleDestroy() {}
	
	async handleConnection(client){
		console.log(`Client connecter ${client.id}`)
		console.log(client.handshake.headers.cookie)
		const user_rooms  = await this.getRooms(1);
		for (let i = 0; i < user_rooms.length; i++)
		{
			client.join(user_rooms[i].rooms.id.toString() );
		}
	}
	handleDisconnect(client){
		console.log(`Client disconnected ${client.id}`)
	}
	@SubscribeMessage("chat")
	@inRoom()
	async onMessage( @ConnectedSocket() client, @MessageBody() message: ChatSocketDto)
	{
			console.log(message)
			const res = await this.prisma.$transaction(async (trx) =>
			{
				const msgid = await trx.messages.create({data: {sender_id: 1, room_id: message.Destination, messages:message.Message}})
				await trx.rooms.update({where :{id : message.Destination,},data:{updated_at: msgid.created_at}})
				return await trx.messages.findUnique({where :{id:msgid.id},select:{created_at: true,room_id:true, messages: true,senderid:{select:{id: true,nickname:true,avatar: true,}}}})
			})
			console.log(res)
			if (res)
				this.server.to(message.Destination.toString()).emit("chat", res);
			else
				client.emit("ChatError", "error sending message");
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
				return data;

	}

}
