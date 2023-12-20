import { IsEnum, IsString, MinLength } from "class-validator"
import { EDifficulty, EMatchingType } from "src/types.ts/game-matching.interface"

export class  MatchingGameDto {
	@IsEnum(EDifficulty)
	difficulty: EDifficulty

	@IsEnum(EMatchingType)
	matchingType: EMatchingType

	@IsString()
	@MinLength(3)
	invite: string
}