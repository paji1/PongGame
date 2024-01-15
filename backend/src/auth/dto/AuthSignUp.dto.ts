import { IsString, IsNotEmpty } from "class-validator";

export class AuthSignUp{
	@IsNotEmpty()
	@IsString()
	nickname : string;
	@IsNotEmpty()
	@IsString()
	password : string;
} 