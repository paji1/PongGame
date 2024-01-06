import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { count } from "console";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessagesService {
	constructor(private readonly prisma: PrismaService) {}
	async send_message(Requester: number, room: number, message: string) {
		try {
			const conv = this.prisma.$transaction(async (t) => {
				const msg = await t.messages.create({
					data: {
						sender_id: Requester,
						room_id: room,
						messages: message,
					},
					select:
					{
						room_id:true,
						created_at:true,
						messages:true,
						senderid: {
							select:
							{
								id:true,
								avatar:true,
								nickname:true,
							}
						}
					}
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
			})
			return conv;
		} catch (error) {
			return null
		}
	}
	async get_messages(Requester: number) {
		const blocked = (await this.prisma.friendship.findMany({
			where:
				{
					status:{
						not: "DEFAULT"
					},
					OR:[
						{
							initiator: Requester,
						},
						{
							reciever: Requester,
						}
					]
				}
		})).map((blockrel) => blockrel.initiator === Requester ? blockrel.reciever : blockrel.initiator)
		console.log("blocked re ", blocked)
		const conversation = await this.prisma.rooms.findMany({
			where: {
					rooms_members: {
						some: {
							userid: Requester,
							NOT:
							{
								isBanned:true,
							}
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
		
		conversation.map((conv) =>  conv.messages = conv.messages.filter((message) => !blocked.includes(message.senderid.id)))
		
		return conversation;
	}

	async get_rooms(id: number) {
		const blocked = (await this.prisma.friendship.findMany({
			where:
				{
					status:{
						not: "DEFAULT"
					},
					OR:[
						{
							initiator: id,
						},
						{
							reciever: id,
						}
					]
				}
		})).map((blockrel) => blockrel.initiator === id ? blockrel.reciever : blockrel.initiator)
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
					messages:
					{
						where:
						{
							NOT:
							{
								roomid:
								{
									rooms_members:
									{
										some:{
											userid: id,
											AND:
											{
												isBanned:true,
											}
										}
									}
								}
							}
						},
						select:
						{
							sender_id:true,
							messages:true
						},
						orderBy:{
							created_at:"desc"
						},
						take: 1
					},
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
			data.map((room) =>  {
				if (room.messages[0].messages && blocked.includes(room.messages[0].sender_id))
					room.messages[0].messages = "from a blocked user";
			})
			return data;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
		}
	}

	async satisfy(Requester : number, room: number, ofsset:number)
	{
		const blocked = (await this.prisma.friendship.findMany({
			where:
				{
					status:{
						not: "DEFAULT"
					},
					OR:[
						{
							initiator: Requester,
						},
						{
							reciever: Requester,
						}
					]
				}
		})).map((blockrel) => blockrel.initiator === Requester ? blockrel.reciever : blockrel.initiator)
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
		conversation.messages = conversation.messages.filter((message) =>  !blocked.includes(message.senderid.id));

		return conversation;
	}
}
