import { IsEnum, IsString, MinLength, ValidateIf } from "class-validator"
import { EDifficulty, EMatchingType } from "src/types.ts/game-matching.interface"

export class  MatchingGameDto {
	@IsEnum(EDifficulty, {message: "Invalid game mode"})
	difficulty: EDifficulty

	@IsEnum(EMatchingType, {message: "Invalid matching system"})
	matchingType: EMatchingType

	@ValidateIf(dto => dto.matchingType === EMatchingType.INVITE)
	@IsString({message: "Player is not available"})
	@MinLength(3, {message: "Player is not available"})
	invite?: string
}