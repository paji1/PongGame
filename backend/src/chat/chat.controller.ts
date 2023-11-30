import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { user_permission, roomtype } from "@prisma/client";
import { RoomDto , MessageDto , MuteDto} from "../Dto/rooms.dto";
import { IsNotEmpty,MinLength ,MaxLength ,ValidateIf, IsEnum, IsString, IsNumber, Min} from "class-validator";
import { RoomPermitions } from "src/common/decorators/RoomPermitions.decorator";
import { RoomType } from "src/common/decorators/RoomType.decorator";

@Controller("chat")
export class ChatController {
	constructor(private readonly service: ChatService) {}
	/**
	 * @description
	 */
	@Post("creation/")
	async roomAddExistance(@Body() Room : RoomDto) {
		return await this.service.rooms.create_room(1, Room);
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
	async roomHumansJoin( @Query("room") room: number, @Body() Room: RoomDto) {
		return await this.service.rooms.join_room(1, room, Room);
	}
	/**
	 * @description
	 */
	@Delete("humans/")
	@RoomPermitions(user_permission.admin , user_permission.participation)
	@RoomType(roomtype.protected, roomtype.public, roomtype.private)
	async roomHumansLeave(@Query("room") room: number) {
		return await this.service.rooms.leave_room(1, room);
	}


	@Post("humans/invite/")
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private, roomtype.protected, roomtype.public)
	async roomHumanInvite(@Query("room")  room: number, @Query("friend") friend: number)
	{
		return await this.service.rooms.invite_room(1, friend, room)
	}
	/**
	 * @description
	 */
	@Get("comunication")
	@RoomPermitions(user_permission.owner, user_permission.admin ,user_permission.participation, user_permission.chat)
	async humanFetchMessage(@Query("room") room: number) {
		return await this.service.messages.get_messages(1, room);
	}
	/**
	 * @description
	 */
	@Post("comunication")
	@RoomPermitions(user_permission.owner, user_permission.admin ,user_permission.participation, user_permission.chat)
	async humanSentMessage(@Query("room") room: number ,@Body() message: MessageDto) {
		return await this.service.messages.send_message(1, room, message.text);
	}
	/**
	 * @description
	 */ 
	@Get("town")
	async getHumanRooms() {
		return this.service.messages.get_rooms(1);
	}
	/**
	 * @description
	 */
	@Post("samak")
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private , roomtype.protected, roomtype.public)
	async HumanBlock(@Query("room") room: number , @Query("target") target: number ) {
		//block_user
		return await this.service.rooms.block_user(target , room);
	}
	/**
	 * @description
	 */
	@Patch("unblock")
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private , roomtype.protected, roomtype.public)
	async humanUnblock(@Query("room") room: number , @Query("target") target: number) {
		// unblock_user
		return await this.service.rooms.unblock_user(target, room);
	}
	/**
	 * @description
	 */
	@Post("samaklite")
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private , roomtype.protected, roomtype.public)
	async humanMute(@Query("room") room: number,@Query("type") type: string, @Body() mute: MuteDto ) {
		//mute_user
		if (type === "umute")
			return await this.service.rooms.unmute_user(mute.target, room);
		return await this.service.rooms.mute_user(mute.target, room, mute.duration);
	}
	/**
	 * @description
	 */
	@Post("diwana")
	@RoomPermitions(user_permission.owner)
	@RoomType(roomtype.private , roomtype.protected, roomtype.public)
	async giveHumanAuth(@Query("room") room: number, @Query("user") user: number) {
		return await this.service.rooms.give_room_admin(room, user);
	}
	/**
	 * @description
	 */
	@Patch("diwana")
	@RoomPermitions(user_permission.owner, user_permission.admin)
	@RoomType(roomtype.private , roomtype.protected, roomtype.public)
	async takeHumanAuth(@Query("room") room: number, @Query("user") user: number) {
		return await this.service.rooms.revoke_room_admin( room, user);
	}
}
