import { Controller, Get, Post,Delete, Query,Patch, HttpException, HttpStatus, Res } from '@nestjs/common';
import { InviteService } from './invite.service';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
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

  @Get("exp")
	async GetExpUser(@GetCurrentUserId() id: number) {
		return await this.inviteService.GetExpUser(id);
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
    invite.issuer_id.achieved = Array.isArray(invite.issuer_id.achieved) ? invite.issuer_id.achieved : []
    await this.inviteService.handleachivment(invite.issuer_id)
    delete invite.issuer_id.achieved
    this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
    this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    res.status(200).end()
  }

  @Delete('friend')
  async FriendRemove(@GetCurrentUserId() user:number, @Query('friend') friend: number, @Res() res, @GetCurrentUser('user42') myname:string)
  {
    const friendname = await this.inviteService.RemoveFriend(user, friend)
    if (friendname)
      {
        res.status(200).end();
        this.events.emit("PUSH", friendname, [ {"user42": myname, "connection_state": "DEL"} ], "ON_STATUS")
        this.events.emit("PUSH", myname, [ {"user42": friendname, "connection_state": "DEL"} ], "ON_STATUS")
      }
    else
      res.status(400).end();
  }



  @Post('friend/invite')
  async FriendAccept( @GetCurrentUserId() user:number, @Query('id') id: number,@Res() res)
  {
    const data =  await this.inviteService.AcceptFriend( user, id);
    let invite;
    if (Array.isArray(data))
       invite = data[0]
      else
      invite = data

    if (!invite)
      throw new HttpException("Failed inviting", HttpStatus.BAD_REQUEST)

    this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")

    this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")

    this.events.emit("PUSH", invite.reciever_id.user42, [ {"user42": invite.issuer_id.user42, "connection_state": invite.issuer_id.connection_state} ], "ON_STATUS")

    this.events.emit("PUSH", invite.issuer_id.user42, [ {"user42": invite.reciever_id.user42, "connection_state": invite.reciever_id.connection_state} ], "ON_STATUS")

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
        const invite =   await this.inviteService.RejectFriend(user, id);
        this.events.emit("PUSH", invite.reciever_id.user42, invite, "INVITES")
        this.events.emit("PUSH", invite.issuer_id.user42, invite, "INVITES")
    }catch{
      throw new HttpException("error acepring conection", HttpStatus.BAD_REQUEST)
    }
    

  }



}
