import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { GetCurrentUser, GetCurrentUserId, Public } from "src/common/decorators";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { userDatadto } from "../auth/dto";
import { JwtPayload } from "src/auth/types";

@Controller("users")
export class UsersController {
	constructor(
		private readonly users: UsersService,
	) {}
	@Get()
	async getuser(@GetCurrentUserId() id: number) {
		return await this.users.getuser(id);
        
	}

	@Get("/search/:user")
	async getqueryusers(@GetCurrentUserId() id: number, @Param("user") user: string) {
		const users = await this.users.getusersbyname(id, user);
		return users;
	}

	@Public()
	@Get("/isLogin")
	async islogin(@Req() req: Request,@Res() res: Response) : Promise<boolean> {
		return await this.users.is_login(req, res);
	}
}
