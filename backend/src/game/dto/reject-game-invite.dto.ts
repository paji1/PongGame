import { actionstatus, invitetype } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class RejectGameInviteDto {

	@IsNumber()
	@Min(1)
	id: number;

	@IsEnum(invitetype)
	type: invitetype;

	@IsNumber()
	@Min(1)
	issuer_id: number;

	@IsNumber()
	@Min(1)
	reciever_id: number;

	@IsString()
	@IsNotEmpty()
	game_id: string;

	@IsEnum(actionstatus)
	status: actionstatus;
}