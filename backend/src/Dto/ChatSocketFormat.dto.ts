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

export class ChatSocketDto
{
    @IsNumber()
    Destination: number;
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    Message: string
}