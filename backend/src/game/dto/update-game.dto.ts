import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { game_state } from '@prisma/client';

export class UpdateGameDto extends PartialType(CreateGameDto) {

	static readonly HIGHEST_SCORE: number = 42;

	@IsInt()
	@Min(0)
	@Max(UpdateGameDto.HIGHEST_SCORE, {message: `Player's score must not be greater than ${UpdateGameDto.HIGHEST_SCORE}`})
	readonly	score1: number

	@IsInt()
	@Min(0)
	@Max(UpdateGameDto.HIGHEST_SCORE, {message: `Player's score must not be greater than ${UpdateGameDto.HIGHEST_SCORE}`})
	readonly	score2: number

	@IsEnum(game_state)
	readonly	state: game_state
}
