import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { RoomsService } from '../chat/rooms/rooms.service'
import { actionstatus, invitetype } from '@prisma/client';
import { REFUSED } from 'dns';
import { use } from 'passport';

@Injectable()
export class InviteService {
    constructor(private readonly prisma: PrismaService, private readonly roomservice: RoomsService) {}

  
   

    async getdatainvite(userid:number)
    {
        const invites = await this.prisma.invites.findMany({
            where:
            {
                OR:
                [
                    {
                        reciever:userid,
                    },
                    {
                        issuer:userid,
                    }

                ]
            },
            select:
            {
                id:true,
                type:true,
                created_at:true,
                status:true,
                issuer_id:
                {
                    select:
                    {
                        id:true,
                        nickname:true,
                        user42:true,
                        avatar:true
                    },
                },
                reciever_id:
                {
                    select:
                    {
                        nickname:true,
                    }
                },
                room_id: {
                    select: {
                        id:true,
                        name: true
                    }
                },
            },
        })
        return (invites);
    }

    

    async InviteFriend(user:number, friend:number)
    {
        const res = await this.prisma.$transaction(async ( trx) => {
            const control = await trx.friendship.findMany(
                {
                where:{
                    
                    OR:
                    [
                        {
                            reciever: user,
                            initiator: friend
                        }
                        ,

                        {
                            reciever: friend,
                            initiator: user
                        },

                    ]
                }})
                if (control.length)
                    return null
            return await trx.invites.create({data:{type: invitetype.Friend,status: actionstatus.pending,issuer:user,reciever:friend,}, 
                select:
                {
                    id:true,
                    type:true,
                    created_at:true,
                    status:true,
                    issuer_id:
                    {
                        select:
                        {
                            id:true,
                            nickname:true,
                            user42:true,
                            avatar:true
                        },
                    },
                    reciever_id:
                    {
                        select:
                        {
                            id:true,
                            nickname:true,
                            user42:true
                        }
                    },
                    room_id: {
                        select: {
                            id:true,
                            name: true
                        }
                    },
                },
        })
        })
        return res;
    }
    async RemoveFriend()
    {

    }

    async AcceptFriend(user, invite)
    {
        const res = await this.prisma.$transaction(async (trx)=>{
            const control = await trx.invites.update({
                where:
                {
                    id:invite,
                    reciever:user,
                    status:'pending',
                    type:'Friend'
                },
                data:
                {
                    status:'accepted'
                },
                select:
            {
                id:true,
                type:true,
                created_at:true,
                status:true,
                issuer_id:
                {
                    select:
                    {
                        id:true,
                        nickname:true,
                        user42:true,
                        avatar:true
                    },
                },
                reciever_id:
                {
                    select:
                    {
                        id:true,
                        user42:true,
                        nickname:true,
                    }
                },
                room_id: {
                    select: {
                        name: true
                    }
                },
            },

            })
            const lenght = await trx.invites.count({
                where:
                {
                    OR:[
                        {reciever:control.reciever_id.id, issuer: control.issuer_id.id},
                        {reciever:control.issuer_id.id, issuer: control.reciever_id.id},
                    ],
                    status:'accepted',
                    type:'Friend',
                }
            }) 
            await trx.friendship.create({
                data:
                {
                    initiator: control.issuer_id.id,
                    reciever: control.reciever_id.id,
                    status:'DEFAULT'
                }
            })
            if (lenght > 1)
                return control;
              const room = await trx.rooms.create(
                {
                    data:{
                        roomtypeof:'chat',
                        rooms_members:
                        {
                            createMany : {

                                data:
                                [
                                    {
                                        permission:'chat',
                                        
                                        userid:control.issuer_id.id,
                                    },
                                    {
                                        permission:'chat',
                                        userid:control.reciever_id.id,
                                    },

                                ]

                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        roomtypeof: true,
                        updated_at: true,
                        messages:
                        {
                            select:
                            {
                                messages:true
                            },
                            orderBy:{
                                created_at:"desc"
                            },
                            take: 1
                        },
                        rooms_members:{
                            select:
                            {
                                id: true,
                                roomid: true,
                                permission: true,
                                isblocked: true,
                                isBanned: true,
                                ismuted: true,
                                created_at: true,
                                user_id: {
                                    select: {
                                        id: true,
                                        nickname: true,
                                        avatar: true,
                                    },
                                },
                            }
                        }
                    },
                }
                )
                return [control, room]
            
        })
        return res
    }

    async RejectFriend(user, invite)
    {
        const reject = await  this.prisma.invites.update(
            {
                where: {
                    id:invite,
                    status: 'pending',
                    type:'Friend',
                    reciever:user,
                }
                ,data:{
                    status:"refused",
                }
            }
            
        )
    }

	async acceptGameInvite(current_user: number, id: number) {
		return await this.prisma.invites.update({
			where: {
				id: id,
				reciever: current_user,
				status: actionstatus.pending,
				type: invitetype.Game
			},
			data: {
				status: actionstatus.accepted,
			},
			select:
            {
                id:true,
                type:true,
                created_at:true,
                status:true,
                issuer_id:
                {
                    select:
                    {
                        id:true,
                        nickname:true,
                        user42:true,
                        avatar:true
                    },
                },
                reciever_id:
                {
                    select:
                    {
                        nickname:true,
						user42: true,
                    }
                },
            }
		})
	}
}


