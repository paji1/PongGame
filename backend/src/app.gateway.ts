import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AtGuard } from './common/guards';
import { UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';
import { PrismaService } from './prisma/prisma.service';
import { current_state } from '@prisma/client';
import { Server } from "socket.io";
import { stat } from 'fs';
import { RoomGuard } from './common/guards/chat/RoomGuards.guard';

@WebSocketGateway()
@UseGuards(RoomGuard)
@UseGuards(AtGuard)
export class AppGateway {

  constructor(
		private readonly prisma: PrismaService,
	) {
	}

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
			console.log(state)
		}
	}	





  @SubscribeMessage("HANDSHAKE")
	async sayHitoserver(@GetCurrentUser("user42") identifier:string, @GetCurrentUser("sub") id:number, @ConnectedSocket() client)
	{
		
		client.join(identifier);
		if ((await this.server.to(identifier).fetchSockets()).length == 1)
		{
			const	state = await this.prisma.user.update({where:{user42:identifier,},data:{connection_state: current_state.ONLINE}});
			console.log(state)
			
		}
	}



	@SubscribeMessage("getstatus")
	async setstatus(@GetCurrentUser("user42") identifier:string, @GetCurrentUser("sub") id:number, @MessageBody() user:number)
	{
		
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