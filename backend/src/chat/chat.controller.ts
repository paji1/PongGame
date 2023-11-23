import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { permission } from "@prisma/client";
import { MuteDto, blockFormDto, messageDto, roomDto, roomEntity } from "../Dto/chat.dto";
import { createHash } from "crypto";

@Controller("chat")
export class ChatController {
	constructor(private readonly service: ChatService) {}
	/**
	 * @description
	 */
	@Post("creation/")
	async roomAddExistance(@Body() room: roomEntity, @Query("user") user: number) {
		//check if room entity is valid
		console.log(user);
		if (room.type === permission.protected && room.password.length <= 6)
			throw new HttpException("password must be bigger than 6", HttpStatus.FORBIDDEN);
		if (room.type !== permission.protected && room.password.length)
			throw new HttpException("room Doesnt support password", HttpStatus.FORBIDDEN);
		if (room.type === permission.chat) return await this.service.rooms.create_chat(500, user);
		if (room.password.length) room.password = createHash("sha256").update(room.password).digest("hex");
		return await this.service.rooms.create_room(1, room);
	}
	/**
	 * @description
	 */
	@Delete("creation")
	async roomDellExistance(@Query("room") room: number) {
		return await this.service.rooms.delete_room(1, room);
	}

	/**
	 * @description
	 */
	@Post("humans")
	async roomHumansJoin(@Body() room: roomEntity, @Query("room") roomid: number) {
		//create_room
		if (room.password.length) room.password = createHash("sha256").update(room.password).digest("hex");
		return await this.service.rooms.join_room(1, room, roomid);
	}
	/**
	 * @description
	 */
	@Delete("humans/:room")
	async roomHumansLeave(@Query("room") room: number) {
		console.log("param :", room);

		return await this.service.rooms.leave_room(1, room);
	}
	/**
	 * @description
	 */
	@Get("comunication")
	async humanFetchMessage(@Query("room") room: number) {
		//get room messages
		return await this.service.messages.get_messages(1, room);
	}
	/**
	 * @description
	 */
	@Post("comunication")
	async humanSentMessage(@Body() message: messageDto) {
		// send a message to a room
		console.log(message)

		return await this.service.messages.send_message(1, message.destination, message.text);
	}
	/**
	 * @description
	 */ 
	@Get("town")
	async getHumanRooms() {
		//get_a human rooms
		return this.service.messages.get_rooms(1);
	}
	/**
	 * @description
	 */
	@Post("samak")
	async HumanBlock(@Body() block: blockFormDto) {
		//block_user
		return await this.service.rooms.block_user(1, block.usertarget, block.roomtarget);
	}
	/**
	 * @description
	 */
	@Patch("unblock")
	async humanUnblock(@Body() block: blockFormDto) {
		// unblock_user
		return await this.service.rooms.unblock_user(1, block.usertarget, block.roomtarget);
	}
	/**
	 * @description
	 */
	@Post("samaklite")
	async humanMute(@Body() mute: MuteDto, @Query("type") type: string) {
		//mute_user
		if (type === "umute") return await this.service.rooms.unmute_user(1, mute.targeted, mute.roomtarget);

		return await this.service.rooms.mute_user(1, mute.targeted, mute.roomtarget, mute.time);
	}
	/**
	 * @description
	 */
	@Post("diwana")
	async giveHumanAuth(@Query("room") room: number, @Query("user") user: number) {
		return await this.service.rooms.give_room_admin(2, room, user);
	}
	/**
	 * @description
	 */
	@Patch("diwana")
	async takeHumanAuth(@Query("room") room: number, @Query("user") user: number) {
		return await this.service.rooms.revoke_room_admin(2, room, user);
	}
}
