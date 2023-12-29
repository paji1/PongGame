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



export class ActionDTO
{
	@IsNumber()
	target: number;

	@IsNumber()
	room: number

	@IsString()
	@IsNotEmpty()
	What: string;
}

