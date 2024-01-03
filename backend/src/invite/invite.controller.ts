import { Controller, Get, Post,Delete, Query,Patch, HttpException, HttpStatus, Res } from '@nestjs/common';
import { InviteService } from './invite.service';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService,
    private events: EventEmitter2) {}
  
  @Get()
  async Handler(@GetCurrentUserId() user:number)
  {
    // console.log("mok ")
    return await this.inviteService.getdatainvite(user);
  }


  @Post('friend')
  async Friendinvite(@GetCurrentUserId() user:number,  @Query('friend') friend: number, @Res() res)
  {
    const invite =  await this.inviteService.InviteFriend(user, friend);
    // console.log(invite)
    if (!invite)
      throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)
    this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
    this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    res.status(200).end()
  }

  @Delete('friend')
  async FriendRemove(@Query('friend') id: number)
  {
    const invite =  await this.inviteService.RemoveFriend();
  }



  @Post('friend/invite')
  async FriendAccept( @GetCurrentUserId() user:number, @Query('id') id: number,@Res() res)
  {
    // console.log("accepting rquest " , id)
    const data =  await this.inviteService.AcceptFriend( user, id);
    let invite;
    invite = data
    if (Array.isArray(data))
       invite = data[0]
    if (!invite)
    throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)
  this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
  this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    if (Array.isArray(data))
    {
      this.events.emit("PUSH", invite.reciever_id.user42, {region: "ROOM", action:"JOIN", data: data[1]}, "ACTION")
      this.events.emit("PUSH", invite.issuer_id.user42, {region: "ROOM", action:"JOIN", data: data[1]}, "ACTION")
    }

  res.status(200).end()
}
  

  @Delete('friend/invite')
  async FriendReject( @GetCurrentUserId() user:number,@Query('id') id: number)
  {
    try {
        return  await this.inviteService.RejectFriend(user, id);

    }catch{
      throw new HttpException("erroc acepring conection", HttpStatus.BAD_REQUEST)
    }
    

  }



}
