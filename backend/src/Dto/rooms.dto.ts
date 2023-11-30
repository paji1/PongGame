import { IsNotEmpty,MinLength ,MaxLength ,ValidateIf, IsEnum, IsString, IsNumber, Min, isNumber} from "class-validator";
import { user_permission, roomtype } from '@prisma/client';



export class RoomDto{
    @IsNotEmpty()
    name: string
    @IsEnum(roomtype)
    type: roomtype

    password: string
}


export class MessageDto
{
    @IsNotEmpty()
    text: string	
}

export class MuteDto
{
    @IsNumber()
    target: number

    duration: number

}