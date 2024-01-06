import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator"
import { EDifficulty } from "src/types.ts/game-matching.interface"

export class AcceptGameInviteDto {

	@IsNumber()
	@Min(1, {message: "Invalid invite ID"})
	invite_id: number

	@IsNumber()
	@Min(1, {message: "Invalid user ID"})
	issuer_id: number

	@IsNumber()
	@Min(1, {message: "Invalid user ID"})
	receiver_id: number

	@IsString()
	@IsNotEmpty({message: "Invalid issuer username"})
	issuer_name: string

	@IsString()
	@IsNotEmpty({message: "Invalid reciever username"})
	reciever_name: string

	@IsString()
	@IsNotEmpty({message: "Invalid game ID"})
	game_id: string

	@IsEnum(EDifficulty)
	@IsNotEmpty({message: "Invalid game mode"})
	game_mode: EDifficulty
}