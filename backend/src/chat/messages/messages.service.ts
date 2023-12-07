import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { count } from "console";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessagesService {
	constructor(private readonly prisma: PrismaService) {}
	async send_message(Requester: number, room: number, message: string) {
		const membership = await this.prisma.rooms_members.findUnique({
			where: { combination: { userid: Requester, roomid: room } },
		});
		console.log("hnayahnaya" ,)
		if (membership.isblocked || membership.ismuted) throw new HttpException("cant send message", 403);
		const conv = this.prisma.$transaction(async (t) => {
			const msg = await t.messages.create({
				data: {
					sender_id: Requester,
					room_id: room,
					messages: message,
				},
			});
			await t.rooms.update({
				where:
				{
					id: room,
				},
				data:{
					updated_at: msg.created_at
				}
			})
			return msg
		})
		return conv;
	}
	async get_messages(Requester: number) {
	
		const conversation = await this.prisma.rooms.findMany({
			where: {
				rooms_members : {
					some: {
							userid: Requester,
					}
				}
			},
			select: {
				id:true,
				messages: 
				{
					select:
					{
						created_at: true,
						messages: true,
						senderid:
						{
							select:
							{
								id: true,
								nickname:true,
								avatar: true,
							}
						}
					},
					orderBy: {
						created_at: "desc"
					},
					take: 30,
				},
			},
			orderBy: {
				updated_at: "desc"
			},
		});
		return conversation;
	}

	async get_rooms(id: number) {
		try {
			const data = await this.prisma.rooms.findMany({
				where: {
					rooms_members : {
						some: {
								userid: id,
						}
					}
				},
				orderBy:{
					updated_at: "desc",
				},
				select: {
					id:true,
					name:true,
					roomtypeof:true,
					updated_at:true,
					rooms_members:
					{
						select:
						{
							user_id:{
								select:{
									id:true,
									nickname: true,
									avatar: true,
								}
							}
						}
					}
				}
			});
			console.log(  data,  "hba")
			return data;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
		}
	}
}
