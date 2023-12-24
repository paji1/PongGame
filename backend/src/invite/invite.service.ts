import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { RoomsService } from '../chat/rooms/rooms.service'
import { actionstatus, invitetype } from '@prisma/client';

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


    async InviteFriend(user:number, friend:number)
    {
        const res = await this.prisma.$transaction(async ( trx) => {
            const control = await trx.invites.findMany(
                {
                where:{
                    OR:
                    [
                        {
                            issuer:user,
                            reciever:friend,
                        },
                        {
                            issuer:friend,
                            reciever: friend
                        }
                    ]
                }})
            if (control.findIndex((invite) => invite.type ===  invitetype.Friend) !== -1)
            {
                console.log(control.find((invite) => invite.type ===  invitetype.Friend))
                return null
            }
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
        return null
    }
    async RemoveFriend()
    {

    }

    AcceptFriend()
    {

    }

    RejectFriend()
    {

    }
}
