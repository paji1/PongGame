import { IsEnum, IsString, MinLength } from "class-validator"
import { EDifficulty, EMatchingType } from "src/types.ts/game-matching.interface"

export class  MatchingGameDto {
	@IsEnum(EDifficulty, {message: "Invalid game mode"})
	difficulty: EDifficulty

	@IsEnum(EMatchingType, {message: "Invalid matching system"})
	matchingType: EMatchingType

	@IsString()
	@MinLength(3, {message: "Invalid nickname"})
	invite: string
}