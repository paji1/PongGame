import { Controller, Get, Param } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private readonly users: UsersService,)
    {}
    @Get()
    async getuser(@GetCurrentUserId() id:number)
    {
        return await this.users.getuser(id);
    }

   
    @Get("/search/:user")
    async getqueryusers(@Param("user") user : string)
    {
        const users = await this.users.getusersbyname(user)
        console.log(users)
		return users;
    }
}
