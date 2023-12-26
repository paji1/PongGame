import { Controller, Get, Param, Post } from '@nestjs/common';
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
    async getqueryusers(@GetCurrentUserId() id:number,  @Param("user") user : string)
    {
        const users = await this.users.getusersbyname(id, user)
		return users;
    }

    

}
