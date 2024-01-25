import { actionstatus, game_modes, invitetype } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateGameInviteDto {
	@IsEnum(invitetype)
	type: invitetype

	@IsEnum(actionstatus)
	status: actionstatus

	@IsNumber()
	@Min(1)
	issuer: number

	@IsNumber()
	@Min(1)
	reciever: number

	@IsEnum(game_modes)
	game_mode: game_modes

	@IsString()
	@IsNotEmpty()
	game_id: string
}