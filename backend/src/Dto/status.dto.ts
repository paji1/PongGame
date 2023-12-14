import { IsEnum, IsNumber, IsString } from "class-validator";

export enum action {
	update,
	get,
}

export class statusDto {
	@IsEnum(action)
	action: action;
	@IsNumber()
	user: number;
	@IsString()
	status: string;
}
