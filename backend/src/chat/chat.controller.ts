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

	@Get("town")
	async getHumanRooms(@GetCurrentUserId() id:number) {
		return this.service.messages.get_rooms(id);
	}

	@Get("comunication")
	async humanFetchMessage(@GetCurrentUserId() id:number) {
		console.log("hi");
		return await this.service.messages.get_messages(id);
	}
	

	@Get("paginate")
	@RoomPermitions(user_permission.owner, user_permission.admin, user_permission.participation, user_permission.chat)
	async humansatisfy(@Query("room") room: number,@Query("offset") ofsset:number, @GetCurrentUserId() id:number)
	{
		return await this.service.messages.satisfy(id,room, ofsset);
	}

	


	/**
	 * @description invite only chanels have there own way of joining
	 */
	@Post("humans")
	@RoomType(roomtype.protected, roomtype.public)
	async roomHumansJoin(@Query("room") room: number, @Body() Room: RoomDto, @GetCurrentUserId() id:number) {
		return await this.service.rooms.join_room(id, room, Room);
	}
	
	
	@Get("/search/:user")
    async getQueryrooms(@Param("user") room : string)
    {
		const rooms = await this.service.rooms.getroomsbyname(room)
		return rooms;
    }
}
