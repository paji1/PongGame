import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { RoomsService } from '../chat/rooms/rooms.service'

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

    AcceptFriend()
    {

    }

    RejectFriend()
    {

    }

    async getdatainvite()
    {
        const userid = 2;
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
}
