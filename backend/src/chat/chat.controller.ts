import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor (private readonly service : ChatService)
    {
    }

    @Get('new')
    async createRoom()
    {
        await this.service.rooms.createRoom(4);
        return {};
    }

    @Get('rooms')
    async getRooms(){
        return  await this.service.rooms.getRooms(1)
    }
    @Get('message')
    async sendMessage()
    {
        return await this.service.messages.sendMessage(1, 6)
    }

}


