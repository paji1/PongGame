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
		console.log("wslat lhna")
		if (Room.type === roomtype.chat) throw new HttpException("Action Not Allowed", HttpStatus.BAD_GATEWAY);
		if (Room.type === roomtype.protected && Room.password.length < 9)
			throw new HttpException("please provide a better password", HttpStatus.BAD_REQUEST);
		if (Room.type !== roomtype.protected) Room.password = "";
		if (Room.type === roomtype.protected) Room.password = createHash("sha256").update(Room.password).digest("hex");

		console.log("nigga hi")
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
			});
		} catch (e) {
			throw new HttpException("Transaction Failed", HttpStatus.BAD_REQUEST);
		}
		throw new HttpException(`Room: ${Room.name} created`, HttpStatus.OK);
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
			console.log(result, await this.prisma.rooms.findUnique({where:{id:room}}))
		} catch {
			throw new HttpException("Room: delete unsucsessfull", HttpStatus.NOT_FOUND);
		}
		throw new HttpException("Room: deleted", 200);
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
			await this.prisma.rooms_members.delete({
				where: {
					combination: {
						roomid: room,
						userid: Requester,
					},
				},
			});
		} catch (e) {
			throw new HttpException("Error Leaving Room", 400);
		}
		throw new HttpException("User left Room", 400);
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
	async block_user(user: number ,targeted: number, roomtarget: number) {
		try {
			await this.prisma.$transaction(async (trx) =>
			{
				await trx.rooms_members.update({
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
				await trx.blocked.create({
					data:
					{
						initiator: user,
						reciever: targeted
					}});
			}

			)
		} catch {
			throw new HttpException("Block: Unsuccesfull", HttpStatus.NOT_FOUND);
		}
		throw new HttpException("Block: Success", HttpStatus.OK);

	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unblock_user(user: number, targeted: number, roomtarget: number) {
		try {
			await this.prisma.$transaction(async (trx) =>
			{
				await trx.rooms_members.update({
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
				const entry = 
				await trx.blocked.deleteMany({
					where:
					{
						initiator: user,
						reciever: targeted
					}}
					);
			}
			)
		} catch {
			throw new HttpException("unBlock: unsucessfull", HttpStatus.NOT_FOUND);
		}
		throw new HttpException("unBlock: Success", HttpStatus.OK);
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
					AND:
					{
						permission: 
						{
							not: "owner"
						}

					}
				},
			});

		} catch (e) {
			throw new HttpException("kick: unsucessfull", 400);
		}
		throw new HttpException("kick:  succes", 201);
	}
	/**
	 * 
	 * @param targeted 
	 * @param room 
	 * @returns 
	 */
	async mute_user(targeted: number, room: number) {
		try {
			 await this.prisma.rooms_members.update({
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
			throw new HttpException("Mute: unsucesfull (owner and admins can't be muted OR user not in room)",500);
		}
		throw new HttpException("Mute: succes",201);
		
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unmute_user(targeted: number, roomtarget: number) {
		try {
			await this.prisma.rooms_members.update({
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
		} catch {
			throw  new HttpException("Mute: unsucesfull",500);;
		}
		throw new HttpException("Mute:  succes",201);

	}
	/**
	 * 
	 * @param targeted 
	 * @param room 
	 */
	async ban_user(targeted: number, room: number) {
		try {
			 await this.prisma.rooms_members.update({
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
			});
		} catch (e){
			throw new HttpException("Ban: unsucesfull (owner and admins can't be banned OR user not in room)",500);
		}
		throw new HttpException("Ban: succes",201);
		
	}
	/**
	 *
	 * @param Requester
	 * @param targeted
	 * @param roomtarget
	 */
	async unban_user(targeted: number, roomtarget: number) {
		try {
			await this.prisma.rooms_members.update({
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
			});
		} catch {
			throw  new HttpException("Ban:  unsucesfull",500);;
		}
		throw new HttpException("Ban:   succes",201);

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
						isBanned:false,
						ismuted:false,
						permission: user_permission.admin,
					},
				});
			} catch (e) {
				throw new HttpException("User: Failiure",400)
			}
			throw new HttpException("User: garanting admin success",201)
		}
		/**
		 *
		 * @param Requester
		 * @param room
		 * @param user
		 */
		async revoke_room_admin(room: number, user: number) {
			try {
				await this.prisma.rooms_members.update({
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
				
			} catch (e) {
				throw new HttpException("User: Failiure",400)
			}
			throw new HttpException("User: removed admin",201)
		}
		async giveOwnership(owner : number, room: number, user: number) {
			try {
				await this.prisma.$transaction(async (trx) =>
				{
				
					await trx.rooms_members.update({
						where:
						{

							combination:
							{
								roomid:room,
								userid:owner
							},
						}
						,
						data:{
							permission:user_permission.participation,
						}
					})
					await trx.rooms_members.update({
						where:
						{

							combination:
							{
								roomid:room,
								userid:user
							},
						}
						,
						data:{
							permission:user_permission.owner,
							isBanned:false,
							ismuted:false,
						}
					})
	
				})
				
			} catch (e) {
				throw new HttpException("failed to give up ownership",400)
			}
			throw new HttpException("wertok fchanel",201)
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