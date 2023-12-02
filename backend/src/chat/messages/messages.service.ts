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
			await t.rooms.update({
				where:
				{
					id: room,
				},
				data:{
					updated_at: new Date()
				}
			})
			const msg = await t.messages.create({
				data: {
					sender_id: Requester,
					room_id: room,
					messages: message,
				},
			});
			return msg
		})
		return conv;
	}
	async get_messages(Requester: number, room: number) {
		const membership = await this.prisma.rooms_members.findUnique({
			where: { combination: { userid: Requester, roomid: room } },
		});
		if (membership.isblocked) throw new HttpException("Unauthorized", 401);
		const conversation = await this.prisma.messages.findMany({
			where: {
				room_id: room,
			},
			select: {
				id:true,
				senderid: {
					select: {
						id: true,
						avatar: true,
						nickname: true,
					},
				},
				created_at: true,
				messages: true,

			},
			orderBy: {
				created_at: "desc"
			}
		});
		console.log(conversation)
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
					messages:{
						orderBy:
						{
							created_at: "desc"
						},
						take: 1
					},
					rooms_members:
					{
						where:
						{
							id: {
								not: id
							}
							
						},
						select:
						{
							user_id:{
								select:{
									nickname: true,
									avatar: true,
									user42: true,
								}
							}
						}
					}
				}
			});
			console.log(data);
			return data;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
		}
	}
}
