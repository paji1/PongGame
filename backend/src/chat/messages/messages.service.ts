import { Injectable } from '@nestjs/common';
import { count } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService)
    {}
    async sendMessage(pid, rid, message)
    {
        
            const count = await this.prisma.rooms_members.findFirst({
                where: {AND :[{ roomid: Number(rid) }, {userid : Number(pid)}]}
            }    
            )
            if (count == null ||  count.isblocked || count.ismuted)
                throw new Error('error sending message');
            await this.prisma.messages.create({
                data:{
                    room_id: Number(rid),
                    sender_id: Number(pid),
                    messages: message
                }
            })
            

    }
}
