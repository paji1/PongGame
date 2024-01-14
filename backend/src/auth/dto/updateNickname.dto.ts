import { IsNotEmpty, IsString } from "class-validator";

export class UpdateNicknameDto {

	@IsNotEmpty()
	@IsString()
	newNickname: string;
}