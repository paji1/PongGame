import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePassDto {
	@IsNotEmpty()
	@IsString()
	currentPassword: string;
	@IsNotEmpty()
	@IsString()
	newPassword: string;
}