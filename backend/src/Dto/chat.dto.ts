import { IsNotEmpty,MinLength ,MaxLength ,ValidateIf} from "class-validator";
import { participation_type, permission } from '@prisma/client';


export class testDto
{   
    @MinLength(3, {message: 'name is too short',})
    @MaxLength(10, {message: 'name is too long',})
    // @ValidateIf((value) => value.roomtypeof === participation_type.chat)
    name :string
    
    
    roomtypeof : permission
    roompassword : string    
    
    
}