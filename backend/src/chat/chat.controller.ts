import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor (private readonly service : ChatService)
    {}

    @Get('rooms')
    async getRooms(){
        return  await this.service.getrooms()
    }

}
