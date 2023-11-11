import { HttpException, Injectable } from '@nestjs/common';
import { count } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService)
    {}
    async sendMessage(pid, rid, message: string)
    {
        const membership = await this.prisma.rooms_members.findFirst({
            where: {AND :[{ roomid: Number(rid) }, {userid : Number(pid)}]}
        }    
        )
        if (!membership||  membership.isblocked || membership.ismuted)
        throw new HttpException("cant send message", 403);
        if (!message.length)
            throw new HttpException("Not Acceptable", 406);  
        const msg  = await this.prisma.messages.create({
            data:{
                room_id: Number(rid),
                sender_id: Number(pid),
                messages: message
            }
        })
        return msg;
    }
    async getMessages(pid, rid)
    {
        const membership = await this.prisma.rooms_members.findFirst({
            where: {AND :[{ roomid: Number(rid) }, {userid : Number(pid)}]}
        }    
        )
        if (!membership|| membership.ismuted)
            throw new HttpException("Unauthorized", 401);
        const conversation = await this.prisma.messages.findMany({
            where: {
                room_id: rid,
            }
        })
        console.log(conversation)
        return conversation;
    }
}
