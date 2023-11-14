import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { permission } from '@prisma/client';

@Controller('chat')
export class ChatController {
    constructor (private readonly service : ChatService)
    {
    }

    @Get('new')
    async createRoom()
    {
        
        return await this.service.rooms.createRoom(4, permission.chat, "", "");
    }

    @Get('rooms')
    async getRooms(){
        return  await this.service.rooms.getRooms(1)
    }
    @Get('message')
    async sendMessage()
    {
        return await this.service.messages.sendMessage(4, 2, "")
    }

    @Get('join')
    async joinRoom() {
        return await this.service.rooms.joinRoom(1,4)
    }

    @Get('getMessages')
    async getMessages()
    {
        return await this.service.messages.getMessages(4, 2)
    }
    @Get('mute')
    
        async name() {
            return await this.service.rooms.muteParticipant(1, 4,2,60)
        }
    
            
}


