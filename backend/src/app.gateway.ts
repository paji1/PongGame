import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AtGuard } from './common/guards';
import { UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';
import { PrismaService } from './prisma/prisma.service';
import { current_state } from '@prisma/client';
import { Server } from "socket.io";
import { stat } from 'fs';
import { RoomGuard } from './common/guards/chat/RoomGuards.guard';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { List } from './common/classes/adjacent';

@WebSocketGateway()
@UseGuards(RoomGuard)
@UseGuards(AtGuard)
export class AppGateway {

  constructor(
		private readonly prisma: PrismaService,
		private statusnotify: EventEmitter2
		
	) {
		this.UsersNetwork = new List()
	}
	private UsersNetwork : List
	@WebSocketServer()
	server :Server;
 	async handleConnection(client) {
		client.emit("HANDSHAKE", "chkon m3aya")
	}
	
	
	async handleDisconnect(client) {
		const identifier = client.request.headers["user"]
		if (!(await this.server.to(identifier).fetchSockets()).length)
		{
			const	state = await this.prisma.user.update({where:{user42:identifier,},data:{connection_state: current_state.OFFLINE}});
			this.statusnotify.emit("PUSHSTATUS", identifier, state.connection_state)
		}
	}	
	
	@SubscribeMessage("HANDSHAKE")
	async sayHitoserver(@GetCurrentUser("user42") identifier:string, @GetCurrentUser("sub") id:number, @ConnectedSocket() client)
	{
		
		client.join(identifier);
		if ((await this.server.to(identifier).fetchSockets()).length == 1)
		{
			const	state = await this.prisma.user.update({where:{user42:identifier,},data:{connection_state: current_state.ONLINE}});
			this.UsersNetwork.newNode(identifier)
			this.statusnotify.emit("PUSHSTATUS", identifier,state.connection_state)

		}
	}

	@SubscribeMessage("SUBTOUSER")
	async setstatus(@GetCurrentUser("user42") identifier:string, @GetCurrentUser("sub") id:number, @MessageBody() userid:number)
	{
		const	user = await this.prisma.user.findUnique({where:{id: userid,},select:{ user42:true, connection_state:true}})
		if (!user)
			return ;
		this.UsersNetwork.addedge(user.user42, identifier);
		this.server.to(identifier).emit(user.user42, user.connection_state);
	}

	@OnEvent('PUSHSTATUS')
	notifyALL(user: string, status:string)
	{
		this.UsersNetwork.getedges(user).forEach((subscriber:string )=> {
			if (this.server.sockets.adapter.rooms.get(subscriber))
			{
				this.server.to(subscriber).emit(user, status)
			}
		})
		console.log("emited from chat", user, status)
	}

}



/**
 * 
 * 	user conects: 
 * 				->>>>> userstatus set as online
 * 	user join a game:
 * 				-> userstatus as in game
 * 	user leaves a game:
 * 		->>> user status as offligne;
 * 
 * 
 */