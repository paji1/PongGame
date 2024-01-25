import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class UpdatePassDto {
	@IsNotEmpty()
	@IsString()
	currentPassword: string;
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	newPassword: string;
}