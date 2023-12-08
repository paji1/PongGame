import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { invitetype, user_permission, roomtype, actionstatus } from "@prisma/client";
import { createHash } from "crypto";
import { RoomDto } from "../../Dto/rooms.dto";

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
			const re = await this.prisma.$transaction(async (trx) => {
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
		} catch (e) {
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
	async create_room(Requester: number, Room: RoomDto) {
		if (Room.type === roomtype.chat) throw new HttpException("Action Not Allowed", HttpStatus.BAD_GATEWAY);
		if (Room.type === roomtype.protected && Room.password.length < 9)
			throw new HttpException("please provide a better password", HttpStatus.BAD_REQUEST);
		if (Room.type !== roomtype.protected) Room.password = "";
		if (Room.type === roomtype.protected) Room.password = createHash("sha256").update(Room.password).digest("hex");
		console.log(Room.password);
		console.log(Room.password);
		try {
			const result = await this.prisma.$transaction(async (trx) => {
				const newroom = await trx.rooms.create({
					data: {
						name: Room.name,
						roompassword: Room.password,
						roomtypeof: Room.type,
					},
				});
				await trx.rooms_members.create({
					data: {
						roomid: newroom.id,
						userid: Requester,
						permission: user_permission.owner,
					},
				});
				return newroom;
			});
			return result;
		} catch (e) {
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
	async delete_room(room: number) {
		try {
			const result = this.prisma.rooms.delete({ where: { id: room } });
			return result;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
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
			await this.prisma.rooms_members.create({
				data: {
					roomid: room,
					userid: Requester,
					permission: user_permission.participation,
				},
			});
		} catch (e) {
			throw new HttpException("database error", 400);
		}
		return "";
	}
	/**
	 *
	 * @param Requester
	 * @param room
	 * @returns
	 */
	async leave_room(Requester: number, room: number) {
		try {
			const change = await this.prisma.rooms_members.delete({
				where: {
					combination: {
						roomid: room,
						userid: Requester,
					},
				},
			});
		} catch (e) {
			throw new HttpException("database error", 400);
		}
		return "";
	}

	/**
	 *
	 */

	async invite_room(Requester: number, affected: number, room: number) {
		const member = await this.prisma.rooms_members.findUnique({
			where: {
				combination: {
					roomid: room,
					userid: affected,
				},
			},
		});
		if (member) throw new HttpException("User already exist", 404);
		try {
			this.prisma.invites.create({
				data: {
					issuer: Requester,
					reciever: affected,
					room: room,
					type: invitetype.Room,
					status: actionstatus.pending,
				},
			});
		} catch (error) {}
	}



	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 * @returns
	 */
	async block_user(targeted: number, roomtarget: number) {
		try {
			const change = this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: roomtarget,
						userid: targeted,
					},
				},
				data: {
					isblocked: true,
				},
			});
			return change;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
		}
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unblock_user(targeted: number, roomtarget: number) {
		try {
			const change = this.prisma.rooms_members.update({
				where: {
					combination: {
						roomid: roomtarget,
						userid: targeted,
					},
				},
				data: {
					isblocked: false,
				},
			});

			return change;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
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
			return  await this.prisma.rooms_members.update({
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
			});
		} catch (e){
			throw new HttpException("cannot mute", HttpStatus.NOT_FOUND);
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
			const change = this.prisma.rooms_members.update({
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
			});
			return change;
		} catch {
			throw new HttpException("Database error", HttpStatus.NOT_FOUND);
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
				await this.prisma.rooms_members.update({
					where: {
						combination: {
							roomid: room,
							userid: user,
						},
					},
					data: {
						permission: user_permission.admin,
					},
				});
			} catch (e) {
				throw new HttpException(e.code, 400);
			}
			return "ok";
		}
		/**
		 *
		 * @param Requester
		 * @param room
		 * @param user
		 */
		async revoke_room_admin(room: number, user: number) {
			try {
				const entry = await this.prisma.rooms_members.update({
					where: {
						combination: {
							roomid: room,
							userid: user,
						},
					},
					data: {
						permission: user_permission.participation,
					},
				});
				return entry;
			} catch (e) {
				throw new HttpException(e.code, 400);
			}
		}
}

