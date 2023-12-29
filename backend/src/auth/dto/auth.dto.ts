import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	user42: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
