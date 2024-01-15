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
    console.log("mok ")
    return await this.inviteService.getdatainvite(user);
  }


  @Post('friend')
  async Friendinvite(@GetCurrentUserId() user:number,  @Query('friend') friend: number, @Res() res)
  {
    if (user === friend)
    {
      res.status(400).end()
      return ;
    }

    const invite =  await this.inviteService.InviteFriend(user, friend);
    if (!invite)
      throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)
    this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
    this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    res.status(200).end()
  }

  @Delete('friend')
  async FriendRemove(@GetCurrentUserId() user:number, @Query('friend') friend: number, @Res() res)
  {
   
    await this.inviteService.RemoveFriend(user, friend);
    res.status(200).end();
  }



  @Post('friend/invite')
  async FriendAccept( @GetCurrentUserId() user:number, @Query('id') id: number,@Res() res)
  {
    console.log("accepting rquest " , id)
    const data =  await this.inviteService.AcceptFriend( user, id);
    console.log("0")
    let invite;
    if (Array.isArray(data))
       invite = data[0]
      else
      invite = data

    if (!invite)
      throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)
      console.log("1")

    this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
    console.log("2")

    this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    console.log("3", invite.reciever_id, invite.issuer_id)

    this.events.emit("PUSH", invite.reciever_id.user42, [ {"nickname": invite.issuer_id.nickname, "connection_state": invite.issuer_id.connection_state} ], "ON_STATUS")
    console.log("4")

    this.events.emit("PUSH", invite.issuer_id.user42, [ {"nickname": invite.reciever_id.nickname, "connection_state": invite.reciever_id.connection_state} ], "ON_STATUS")
    console.log("5")

    if (Array.isArray(data))
    {
      this.events.emit("PUSH", invite.reciever_id.user42, {region: "ROOM", action:"JOIN", data: data[1]}, "ACTION")
      console.log("6")

      this.events.emit("PUSH", invite.issuer_id.user42, {region: "ROOM", action:"JOIN", data: data[1]}, "ACTION")
      console.log("7")

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
