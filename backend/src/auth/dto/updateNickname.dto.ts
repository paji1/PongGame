import {  IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateNicknameDto {

	@IsNotEmpty()
	@IsString()
	@IsAlphanumeric()
	@MinLength(4)
	@MaxLength(10)
	newNickname: string;
}