import { IsNotEmpty,MinLength ,MaxLength ,ValidateIf, IsEnum, IsString, IsNumber, Min} from "class-validator";
import { participation_type, permission } from '@prisma/client';



export class roomDto{
    @IsNumber()
    @Min(1)
    Requester: Number
    @IsNotEmpty()
    @IsString()
    type: permission


    password: string
    
    name: string
}


export class roomEntity{

    @IsEnum(permission)
    type: permission

    @IsString()
    password: string
    
    @IsString()
    name: string
}

export class messageDto
{
    destination: number
    text: string
}
export class blockFormDto
{
    usertarget: number
    roomtarget: number
}

export class MuteDto
{
    targeted: number
    roomtarget: number
    time: number
}