import { Controller, Get, Post,Delete, Query,Patch } from '@nestjs/common';
import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}
  
  @Get()
  async Handler()
  {
    return await this.inviteService.getdatainvite();
  }

  @Post('Room')
  async RoomAccept(@Query('invite_id') id: number)
  {
    return await this.inviteService.RoomAcceptButton(id);
  }

  @Delete('Room')
  async RoomReject(@Query('invite_id') id: number)
  {
    return await this.inviteService.RoomRejectButton();
  }

  @Post('friend')
  async FriendAccept(@Query('invite_id') id: number)
  {
    return await this.inviteService.AcceptFriend();
  }
  
  @Delete('friend')
  async FriendReject(@Query('invite_id') id: number)
  {
    return await this.inviteService.RejectFriend();
  }
}
