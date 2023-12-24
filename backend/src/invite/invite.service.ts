import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { RoomsService } from '../chat/rooms/rooms.service'
import { actionstatus, invitetype } from '@prisma/client';
import { REFUSED } from 'dns';
import { use } from 'passport';

@Injectable()
export class InviteService {
    constructor(private readonly prisma: PrismaService, private readonly roomservice: RoomsService) {}

    RoomAcceptButton(id :number)
    {
        this.roomservice.acceptinviteRoom(id)
    }

    RoomRejectButton()
    {

    }

   

    async getdatainvite(userid:number)
    {
        const invites = await this.prisma.invites.findMany({
            where:
            {
                reciever:userid,
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
                room_id: {
                    select: {
                        name: true
                    }
                },
            },
        })
        return (invites);
    }
    fdf
        pending
    

    async InviteFriend(user:number, friend:number)
    {
        const res = await this.prisma.$transaction(async ( trx) => {
            const control = await trx.invites.findMany(
                {
                where:{
                    AND:
                    [
                        {
                            OR:
                            [
                                {
                                    type:'Friend',
                                    status:'pending'
                                }  ,
                                {
                                    type:'Friend',
                                    status:'accepted'
                                }
                            ]
                        },
                        {
                        OR:
                        [
                            {
                                issuer:user,
                                reciever:friend,
                            },
                            {
                                issuer:friend,
                                reciever: user
                            }
                        ]
                    }
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
                            user42:true,
                        },
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
                }
            })
            const lenght = await trx.invites.count({
                where:
                {
                    OR:[
                        {reciever:control.reciever, issuer: control.issuer},
                        {reciever:control.issuer, issuer: control.reciever},
                    ],
                    status:'accepted',
                    type:'Friend',
                }
            }) 
            await trx.friendship.create({
                data:
                {
                    initiator: control.issuer,
                    reciever: control.reciever,
                    status:'DEFAULT'
                }
            })
            if (lenght > 1)
                return control;
            return  await trx.rooms.create(
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
                                        
                                        userid:control.issuer,
                                    },
                                    {
                                        permission:'chat',
                                        userid:control.reciever,
                                    },

                                ]

                            }
                        }
                    }
                }
            )
            
        })

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
}


