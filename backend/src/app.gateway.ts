import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AtGuard } from './common/guards';
import { UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from './common/decorators';
import { PrismaService } from './prisma/prisma.service';

@WebSocketGateway()
@UseGuards(AtGuard)
export class AppGateway {

  constructor(
		private readonly prisma: PrismaService,
	) {
	}


  async handleConnection(client) {
		  client.emit("HANDSHAKE", "chkon m3aya")
	}







  @SubscribeMessage("HANDSHAKE")
	async sayHitoserver(@GetCurrentUserId() id:number, @ConnectedSocket() client)
	{
    
		const user = await this.prisma.user.findUnique({
			where:
			{
				id:id
			},
			select:
			{
				nickname: true,
			}
		})
		client.join(user.nickname);
		console.log("handshake success")
	}

}
