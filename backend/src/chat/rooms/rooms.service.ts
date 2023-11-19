import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService)
    {}
    

   /**
    * 
    * @param creator the initiator of the chat
    * @param reciever the second one in the chat
    * @returns return 200 if success 400 on failure
    */
  async create_chat(creator: number, reciever: number)
  {
    if (reciever <= 0 || Number.isNaN(reciever))
      throw new HttpException("member not recieved", HttpStatus.BAD_REQUEST)
    try {
    const re = await this.prisma.$transaction(async (trx) => {
        const newroom = await  trx.rooms.create({data: {roomtypeof: permission.chat}})
        await trx.rooms_members.createMany({data: [{ roomid: newroom.id, userid: creator, permission: participation_type.chat }, {roomid: newroom.id, userid: reciever, permission: participation_type.chat}]})
        })
      }
      catch (e)
      {
        throw new HttpException("Transaction Failed", HttpStatus.BAD_REQUEST);
      }
    throw new HttpException("chat created", HttpStatus.OK);
  }


  /**
   * 
   * @param Requester the room Owener
   * @param room roomEntity {type, password, name}, rontains the data for the room to be created
   * @returns on succes it returns a json to the client on failure it retruns BAD_REQUEST
   */
  async create_room(Requester: number, room: roomEntity)
  {
    
    if (room.name.length <= 0)
      throw new HttpException("name must be bigger than 5", HttpStatus.BAD_REQUEST);
    
      try
      {
        const result = await this.prisma.$transaction(async (trx) => {
            const newroom = await  trx.rooms.create({
                                                      data: 
                                                        {
                                                          name: room.name,
                                                          roompassword: room.password,
                                                          roomtypeof: room.type
                                                        }
                                                      })
            await trx.rooms_members.create({
                                            data: 
                                              {
                                                  roomid: newroom.id,
                                                  userid: Requester,
                                                  permission: participation_type.owner
                                              }
                                          })
            return newroom;
          })
          return result;
      }
      catch (e){
        throw new HttpException("Transaction Failed", HttpStatus.BAD_REQUEST);
      }
  }

    /**
     * 
     * @description permissions owner and chat are the only ones that can delete aconversation
      * @param Requester the room Owener
      * @param room the room id 
      * @returns on succes it returns a json to the client on failure it retruns BAD_REQUEST
      * @returns 
     */
    async delete_room(Requester: number, room: number)
    {
        const data = await this.prisma.rooms_members.findFirst(
          {
            where: {
              roomid: room,
              userid: Requester
            }
          }
        )
        if (data === null)
          throw new HttpException("No such Entry", HttpStatus.BAD_REQUEST);
        if (data.permission === participation_type.admin || data.permission === participation_type.participation)
          throw new HttpException("User is not an owner", HttpStatus.UNAUTHORIZED);
        const result = this.prisma.rooms.delete( { where: {id: room} } )
        return result;
    }

    
    
    async join_room(Requester: number,room :roomEntity , roomid: number)
    {
      const  validate = await this.prisma.rooms.findUnique({where: {id: roomid}});
      if (!validate)
        throw new HttpException("No such Entry", HttpStatus.BAD_REQUEST);


    }
  
  async leave_room(Requester: number, room: number)
  {
    const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: room }, {userid : Requester}]}})
    if (!membership)
    throw new HttpException("Resource not found", 404);
  if (membership.permission === participation_type.owner)
  return await this.delete_room(Requester, room);
if (membership.permission === participation_type.chat)
        throw new HttpException("not Autorized", HttpStatus.UNAUTHORIZED);
      const change = await this.prisma.rooms_members.delete(
        {
          where: 
          {
            combination: {
              roomid: room,
              userid: Requester
            },
          }
        }
        )
        return change;
        
      }
      
      async give_room_admin(Requester: number, room: number , user: number)
      {
          const data = await this.prisma.rooms_members.findFirst( {where: { roomid: room, userid: Requester }})
          if (data.permission !== participation_type.owner)
            throw new HttpException("this action only for room owners", HttpStatus.UNAUTHORIZED)
          const result = this.prisma.rooms_members.update({
            where: { 
              combination: {
                roomid: room,
                userid: user
              }
            },
            data: {
              permission: participation_type.admin
            }
          }) 
          return result;
      }
      async  revoke_room_admin(Requester: number, room: number , user: number)
      {
      
      }
      
      async mute_user(Requester: number, targeted: number, roomtarget: number, timetomute: number)
      {

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(roomtarget) }, {userid : Number(Requester)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission === participation_type.participation)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.update(
          {
            where: 
            {
              combination: {
                roomid: roomtarget,
                userid: targeted
              },
              AND : 
              {
                permission: participation_type.participation
              }
            },
            data : {
              ismuted:true,
              muting_period: timetomute,
              muted_at: new Date()
            }
          }
        )
      return change;
    }
    async unmute_user(Requester: number, targeted: number, roomtarget: number)
    {

    }

    async block_user(Requester: number, targeted: number, roomtarget: number) {
      const particip : participation_type = participation_type.participation;

      const membership = await this.prisma.rooms_members.findFirst({where: {AND :[{ roomid: Number(roomtarget) }, {userid : Number(Requester)}]}}    
      )
      if (!membership)
        throw new HttpException("Resource not found", 404)
      if (membership.permission == particip)
        throw new HttpException("Unauthorized", 401);
        const change = this.prisma.rooms_members.update(
          {
            where: 
            {
              combination: {
                roomid: roomtarget,
                userid: targeted
              }

            },
            data : {
              isblocked:true
            }
          }
        )
      return change;
      
    }

    async unblock_user(Requester: number, targeted: number, roomtarget: number)
    {

    }
}
import { participation_type, permission } from '@prisma/client';
import { roomEntity } from 'Dto/chat.dto';


