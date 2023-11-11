import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService)
    {}
    async sendMessage(pid, rid)
    {
        const message = ""
        const res = await this.prisma.$transaction(async (trx) =>{
            const count = await trx.rooms_members.count({
                where: { AND :[{ roomid: Number(rid) }, {userid : Number(pid)}] }
            }
            )
            if (count != 1)
                throw new Error('inconsistent data')
            await trx.messages.create({
                data:{
                    room_id: Number(rid),
                    sender_id: Number(pid),
                    messages: message
                }
            })
            
        })
    }
}
