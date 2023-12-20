import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { user_permission, roomtype } from "@prisma/client";
import { RoomDto, MessageDto } from "../Dto/rooms.dto";
import { RoomPermitions } from "src/common/decorators/RoomPermitions.decorator";
import { RoomType } from "src/common/decorators/RoomType.decorator";
import { IsFriend } from "src/common/decorators/Friend.decorator";
import { GetCurrentUser, GetCurrentUserId } from "src/common/decorators";
import { RoomGuard } from "src/common/guards/chat/RoomGuards.guard";

@UseGuards(RoomGuard)
@Controller("chat")
export class ChatController {
	constructor(private readonly service: ChatService) {}

	/**
	 *
	 */
	@Get("town")
	async getHumanRooms(@GetCurrentUserId() id:number) {
		return this.service.messages.get_rooms(id);
	}
	/**
	 *
	 *
	 */
	@Get("comunication")
	async humanFetchMessage(@GetCurrentUserId() id:number) {
		console.log("hi");
		return await this.service.messages.get_messages(id);
	}
	/**
	 *
	 * 
	 */
	@Post("comunication")
	@RoomPermitions(user_permission.owner, user_permission.admin, user_permission.participation, user_permission.chat)
	async humanSentMessage(@Query("room") room: number, @Body() message: MessageDto, @GetCurrentUserId() id:number) {
		return await this.service.messages.send_message(id, room, message.text);
	}
	@Get("paginate")
	@RoomPermitions(user_permission.owner, user_permission.admin, user_permission.participation, user_permission.chat)
	async humansatisfy(@Query("room") room: number,@Query("offset") ofsset:number, @GetCurrentUserId() id:number)
	{
		console.log(room, ofsset)
		return await this.service.messages.satisfy(id,room, ofsset);
	}

	/**
	 *
	 * /\
	 * message service
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 * room service
	 * \/
	 *
	 */
	@Post("creation")
	async roomAddExistance(@Body() Room: RoomDto , @GetCurrentUserId() id:number) {
		return await this.service.rooms.create_room(id, Room);
	}
	/**
	 * @description
	 */
	@Delete("creation")
	@RoomPermitions(user_permission.owner)
	@RoomType(roomtype.private, roomtype.protected, roomtype.public)
	async roomDellExistance(@Query("room") room: number) {
		return await this.service.rooms.delete_room(room);
	}

	/**
	 * @description invite only chanels have there own way of joining
	 */
	@Post("humans")
	@RoomType(roomtype.protected, roomtype.public)
	async roomHumansJoin(@Query("room") room: number, @Body() Room: RoomDto, @GetCurrentUserId() id:number) {
		return await this.service.rooms.join_room(id, room, Room);
	}
	/**
	 * @description
	 */
	@Delete("humans")
	@RoomPermitions(user_permission.admin, user_permission.participation)
	@RoomType(roomtype.protected, roomtype.public, roomtype.private)
	async roomHumansLeave(@Query("room") room: number, @GetCurrentUserId() id:number) {
		return await this.service.rooms.leave_room(id, room);
	}

	/**
	 *
	 * @param room
	 * @param friend
	 * @returns
	 */
	@Patch("modify")
	@RoomPermitions(user_permission.owner)
	@RoomType(roomtype.protected, roomtype.public, roomtype.private)
	async roomHumansmodify(@Query("room") room: number, @Body() Room: RoomDto , @GetCurrentUserId() id:number) {
		console.log(room, "dtrodzeb");
		return await this.service.rooms.modify_room(id, room, Room);
	}
	@Post("humans/invite")
	@IsFriend()
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private, roomtype.protected, roomtype.public)
	async roomHumanInvite(@Query("room") room: number, @Query("friend") friend: number , @GetCurrentUserId() id:number) {
		return await this.service.rooms.invite_room(id, friend, room);
	}
}