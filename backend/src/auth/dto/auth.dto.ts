import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	user42: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}
