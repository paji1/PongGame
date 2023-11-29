import { ParseIntPipe } from "@nestjs/common";
import { game_modes } from "@prisma/client";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateGameDto {
	@IsInt()
	readonly player1: number

	@IsInt()
	readonly player2: number

	@IsString()
	@IsNotEmpty()
	readonly game_mode: game_modes
}
