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
				where: {
					id: room,
				},
				data: {
					updated_at: msg.created_at,
				},
			});
			return msg;
		});
		return conv;
	}
	async get_messages(Requester: number) {
		const conversation = await this.prisma.rooms.findMany({
			where: {
				rooms_members: {
					some: {
						userid: Requester,
					},
				},
			},
			select: {
				id: true,
				messages: {
					select: {
						created_at: true,
						messages: true,
						senderid: {
							select: {
								id: true,
								nickname: true,
								avatar: true,
							},
						},
					},
					orderBy: {
						created_at: "desc",
					},
					take: 30,
				},
			},
			orderBy: {
				updated_at: "desc",
			},
		});
		return conversation;
	}

	async get_rooms(id: number) {
		try {
			const data = await this.prisma.rooms.findMany({
				where: {
					rooms_members: {
						some: {
							userid: id,
						},
					},
				},
				select: {
					id: true,
					name: true,
					roomtypeof: true,
					updated_at: true,
					rooms_members: {
						select: {
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
						},
					},
				},
			});
			return data;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
		}
	}

	async satisfy(Requester : number, room: number, ofsset:number)
	{
		const conversation = await this.prisma.rooms.findUnique({
			where: {
					id: room,		
			},
			select: {
				id: true,
				messages: {
					select: {
						created_at: true,
						messages: true,
						senderid: {
							select: {
								id: true,
								nickname: true,
								avatar: true,
							},
						},
					},
					orderBy: {
						created_at: "desc",
					},
					take: 30,
					skip: ofsset
				},
			},
					

		});
		return conversation;
	}
}
