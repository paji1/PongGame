import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { invitetype, user_permission, roomtype, actionstatus } from "@prisma/client";
import { createHash } from "crypto";
import { RoomDto } from "../../Dto/rooms.dto";
import { error } from "console";

@Injectable()
export class RoomsService {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 *
	 * this one will be called on every friend request accept
	 * @param creator the initiator of the chat
	 * @param reciever the second one in the chat
	 * @returns return 200 if success 400 on failure
	 */
	async create_chat(creator: number, reciever: number) {
		try {
			const result = await this.prisma.$transaction(async (trx) => {
				const newroom = await trx.rooms.create({
					data: { roomtypeof: roomtype.chat },
				});
				await trx.rooms_members.createMany({
					data: [
						{
							roomid: newroom.id,
							userid: creator,
							permission: user_permission.chat,
						},
						{
							roomid: newroom.id,
							userid: reciever,
							permission: user_permission.chat,
						},
					],
				});
			});
			return { region: "room", action: "new", data: result };
		} catch (e) {
			return null
		}
	}

	/**
	 *
	 * @param Requester the room Owener
	 * @param room roomEntity {type, password, name}, rontains the data for the room to be created
	 * @returns on succes it returns a json to the client on failure it retruns BAD_REQUEST
	 */
	async create_room(Requester: number, Room: RoomDto) {
		if (Room.type === roomtype.chat) throw new Error("Action Not Allowed");
		if (Room.type === roomtype.protected && Room.password.length < 9)
			throw new Error("please provide a better password");
		if (Room.type !== roomtype.protected) Room.password = "";
		if (Room.type === roomtype.protected) Room.password = createHash("sha256").update(Room.password).digest("hex");
		console.log("nigga hi");
		try {
			const result = await this.prisma.$transaction(async (trx) => {
				const newroom = await trx.rooms.create({
					data: {
						name: Room.name,
						roompassword: Room.password,
						roomtypeof: Room.type,
					},
					select: {
						id: true,
						name: true,
						roomtypeof: true,
						updated_at: true,
					},
				});
				const user = await trx.rooms_members.create({
					data: {
						roomid: newroom.id,
						userid: Requester,
						permission: user_permission.owner,
					},
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
				});

				newroom["rooms_members"] = new Array(1).fill(user);
				return newroom;
			});
			return result
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 */
	async modify_room(Requester: number, room: number, Room: RoomDto) {
		console.log("wslat lhna");
		if (Room.type === roomtype.chat) throw new HttpException("Action Not Allowed", HttpStatus.BAD_GATEWAY);
		if (Room.type === roomtype.protected && Room.password.length < 9)
			throw new HttpException("please provide a better password", HttpStatus.BAD_REQUEST);
		if (Room.type !== roomtype.protected) Room.password = "";
		if (Room.type === roomtype.protected) Room.password = createHash("sha256").update(Room.password).digest("hex");

		try {
			const result = await this.prisma.rooms.update({
				where: { id: room },
				data: {
					name: Room.name,
					roomtypeof: Room.type,
					roompassword: Room.password,
				},
				select: {
					id: true,
					name: true,
					roomtypeof: true,
					updated_at: true,
				},
			});
			console.log(result)
			return result;
		} catch (e) {
			return null
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
	async delete_room(room: number) {
		try {
			const result = await this.prisma.rooms.delete({ where: { id: room } });
			return result ;
		} catch {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param room
	 * @param roomid
	 * @returns
	 */
	async join_room(Requester: number, room: number, Room: RoomDto) {
		const validate = await this.prisma.rooms.findUnique({
			where: { id: room },
		});
		if (validate.roomtypeof !== Room.type)
			throw new HttpException("Nigga  one migga two nigga three", HttpStatus.UNAUTHORIZED);
		if (Room.type === roomtype.protected && Room.password.length > 9)
			Room.password = createHash("sha256").update(Room.password).digest("hex");
		if (Room.type === roomtype.public) Room.password = "";
		console.log(Room.password, validate.roompassword);
		if (Room.password !== validate.roompassword) throw new HttpException("Wrong Password", HttpStatus.UNAUTHORIZED);
		try {
			const res = await this.prisma.rooms_members.create({
				data: {
					roomid: room,
					userid: Requester,
					permission: user_permission.participation,
				},
			});
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param room
	 * @returns
	 */
	async leave_room(Requester: number, room: number) {
		try {
			const result = await this.prisma.rooms_members.delete({
				where: {
					combination: {
						roomid: room,
						userid: Requester,
					},
				},
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

			});
			return  result 
		} catch (e) {
			return null
		}
	}

	/**
	 *
	 */

	

	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 * @returns
	 */
	async block_user(user: number, targeted: number, roomtarget: number) {
		try {
			const data = await this.prisma.$transaction(async (trx) => {
				const data = await trx.rooms_members.update({
					where: {
						combination: {
							roomid: roomtarget,
							userid: targeted,
						},
					},
					data: {
						isblocked: true,
					},
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
				});
				await trx.blocked.create({
					data: {
						initiator: user,
						reciever: targeted,
					},
				});
				return data;
			});
			return data;
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unblock_user(user: number, targeted: number, roomtarget: number) {
		
		try {
			const data = await this.prisma.$transaction(async (trx) => {
				const data = await trx.rooms_members.update({
					where: {
						combination: {
							roomid: roomtarget,
							userid: targeted,
						},
					},
					data: {
						isblocked: false,
					},
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
				});
					await trx.blocked.deleteMany({
					where: {
						initiator: user,
						reciever: targeted,
					},
				});
				return data;
			});
			return data;
		} catch {
			return null
		}
	}
	/**
	 *
	 */

	async kick_room(user: number, room: number) {
		try {
			const change = await this.prisma.rooms_members.delete({
				where: {
					combination: {
						roomid: room,
						userid: user,
					},
					AND: {
						permission: {
							not: "owner",
						},
					},
				},
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
			});
			return change ;
		} catch (e) {
			return null;
		}
	}
	/**
	 *
	 * @param targeted
	 * @param room
	 * @returns
	 */
	async mute_user(targeted: number, room: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: room,
						userid: targeted,
					},
					AND: {
						permission: user_permission.participation,
					},
				},
				data: {
					ismuted: true,
				},
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
			});
			return data;
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unmute_user(targeted: number, roomtarget: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: roomtarget,
						userid: targeted,
					},
					AND: {
						permission: user_permission.participation,
					},
				},
				data: {
					ismuted: false,
				},
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
			});
			return data;
		} catch {
			return null
		}
	}
	/**
	 *
	 * @param targeted
	 * @param room
	 */
	async ban_user(targeted: number, room: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: room,
						userid: targeted,
					},
					AND: {
						permission: user_permission.participation,
					},
				},
				data: {
					isBanned: true,
				},
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
			});
			return data;
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unban_user(targeted: number, roomtarget: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: roomtarget,
						userid: targeted,
					},
					AND: {
						permission: user_permission.participation,
					},
				},
				data: {
					isBanned: false,
				},
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
			});
			return data;
		} catch {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param room
	 * @param user
	 * @returns
	 */
	async give_room_admin(room: number, user: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: room,
						userid: user,
					},
				},
				data: {
					isBanned: false,
					ismuted: false,
					permission: user_permission.admin,
				},
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
			});
			return data 
		} catch (e) {
			return null
		}
	}
	/**
	 *
	 * @param Requester
	 * @param room
	 * @param user
	 */
	async revoke_room_admin(room: number, user: number) {
		try {
			const data = await this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: room,
						userid: user,
					},
				},
				data: {
					permission: user_permission.participation,
				},
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
			});
			return data 
		} catch (e) {
			null
		}
	}
	async giveOwnership(owner: number, room: number, user: number) {
		try {
			const changes = await this.prisma.$transaction(async (trx) => {
				const data = await trx.rooms_members.update({
					where: {
						combination: {
							roomid: room,
							userid: owner,
						},
					},
					data: {
						permission: user_permission.participation,
					},
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
				});
				const data2 = await trx.rooms_members.update({
					where: {
						combination: {
							roomid: room,
							userid: user,
						},
					},
					data: {
						permission: user_permission.owner,
					},
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
				});
				return [data, data2];
			});
			return changes;
		} catch (e) {
			return null
		}
	}
	/**
	 * roomd id:number, issuer: number,affected: number
	 */
	async acceptinviteRoom(inviteid: number) {
		try {
			
			const res = await this.prisma.$transaction(async (trx) => {
				const data = await trx.invites.findUnique({
					where: {
						id: inviteid,
					},
				});
				const changes  = await trx.rooms_members.create({
					data: {
						roomid: data.room,
						userid: data.reciever,
						permission: user_permission.participation,
					},
					select: {
						rooms: {
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
						},
					},
				});
				return changes;
			});
			return  res;
		} catch (e) {
			return null		}
	}
	async invite_room(Requester: number, affected: number, room: number) {
		const member = await this.prisma.rooms_members.findUnique({
			where: {
				combination: {
					roomid: room,
					userid: affected,
				},
			},
			
		});
		if (member)
			return null
		try {
			const invite = await this.prisma.invites.create({
				data: {
					issuer: Requester,
					reciever: affected,
					room: room,
					type: invitetype.Room,
					status: actionstatus.pending,
				},
			});
			return invite;
		} catch (error) {
			null
		}
	}
}

/**
 *  	participant
 * 			for him
 * 				leave room
 * 		admin
 * 			for him
 * 				leave room
 * 				revoke admin right
 * 			for participants
 * 				kick
 * 				ban
 * 				mute
 * 		owner:
 * 			for him:
 * 				nothing
 * 			for admin
 * 				revoke admin right
 * 				give owenership
 * 			for participation
 * 				kick
 * 				ban
 * 				mute
 * 				give admin
 * 				give ownership
 *
 *
 *
 */
