import { game_modes } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGameDto {
	@IsInt()
	readonly player1: number

	@IsInt()
	readonly player2: number

	@IsOptional()
	@IsEnum(game_modes, {message: "Invalid game mode"})
	readonly game_mode: game_modes
}
