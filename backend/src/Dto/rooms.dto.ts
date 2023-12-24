import {
	IsNotEmpty,
	MinLength,
	MaxLength,
	ValidateIf,
	IsEnum,
	IsString,
	IsNumber,
	Min,
	isNumber,
	isString,
} from "class-validator";
import { user_permission, roomtype } from "@prisma/client";

export class RoomDto {
	@IsNumber()
	room:number;
	@IsNotEmpty()
	name: string;
	@IsEnum(roomtype)
	type: roomtype;
	@IsString()
	password: string;
}

export class MessageDto {
	@IsNotEmpty()
	text: string;
}

// bf9e5d91ba6a5d18e2b3c2c9d56a16d2bc6d0e88ef024319df26d6b257ef30b8
