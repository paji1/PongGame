import { IsString, IsNotEmpty, MinLength, IsAlphanumeric, MaxLength } from "class-validator";

export class AuthSignUp{
	@IsNotEmpty()
	@IsString()
	@IsAlphanumeric()
	@MinLength(4)
	@MaxLength(10)
	nickname : string;
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password : string;
} 