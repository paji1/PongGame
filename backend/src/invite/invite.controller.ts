import { Controller, Get, Post,Delete, Query,Patch, HttpException, HttpStatus } from '@nestjs/common';
import { InviteService } from './invite.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService,
    private events: EventEmitter2) {}
  
  @Get()
  async Handler(@GetCurrentUserId() user:number)
  {
    return await this.inviteService.getdatainvite(user);
  }

  @Post('Room')
  async RoomAccept(@Query('') id: number)
  {
    return await this.inviteService.RoomAcceptButton(id);
  }

  @Delete('Room')
  async RoomReject(@Query('invite_id') id: number)
  {
    return await this.inviteService.RoomRejectButton();
  }



  @Post('friend')
  async Friendinvite(@GetCurrentUserId() user:number,  @Query('friend') friend: number)
  {
    const invite =  await this.inviteService.InviteFriend(user, friend);
    if (!invite)
      throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)
    if (invite)
    {

      this.events.emit("PUSH", invite.reciever_id.nickname, invite)
    }
  }

  @Delete('friend')
  async FriendRemove(@Query('friend') id: number)
  {
    const invite =  await this.inviteService.RemoveFriend();
  }



  @Post('friend/invite')
  async FriendAccept(@Query('invite_id') id: number)
  {
    return await this.inviteService.AcceptFriend();
  }
  @Delete('friend/invite')
  async FriendReject(@Query('invite_id') id: number)
  {
    return await this.inviteService.RejectFriend();
  }



}
