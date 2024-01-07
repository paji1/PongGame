import { AuthIntraDto, AuthSignUp, userDto } from "./dto";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Res, Req, Redirect } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Public, GetCurrentUserId, GetCurrentUser, GetUser } from "../common/decorators";
import { RtGuard } from "../common/guards";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { Response } from "express";
import { retry } from "rxjs";
import * as path from "path";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	// @Get("create")
	// @Public()
	// @UseGuards(AuthGuard("intra"))
	// async get_user(@Body() user: any) {}

	// 	// Add your logic here to exchange the authorization code for an access token
	// 	// ...
	// 	const authenticatedUser = req;
	// 	// console.log('Authenticated User:', authenticatedUser);
	// 	// Redirect or respond accordingly
	// 	return "Callback handled";
	// }

	// @Post("info")
	// @UseGuards(AuthGuard("intra"))
	// async inf(@Body() user: any) {
	// 	return console.log("hello world");
	// }


	// TO DO  refactor code to service
	@Post("local/signup")
	@HttpCode(HttpStatus.CREATED)
	async signupLocal(
		@Body() dto: AuthSignUp,
		@Res() res: Response,
		@GetCurrentUser("user42") user42: string,
	): Promise<void> {
		const [tokens, user] = await this.authService.updateLocal(dto, user42);
		await Promise.all([
			res.cookie("userData", JSON.stringify({ user }), { httpOnly: false }),
			this.authService.syncTokensHttpOnly(res, tokens),
		]);
		res.end()
	}


	// tahaTODO password update
	@Post("local/apdate/password")
	@HttpCode(HttpStatus.CREATED)
	async updatePassword(
		@Body() dto: AuthSignUp,
		@Res() res: Response,
		@GetCurrentUser("user42") user42: string,
		): Promise<void> {
			const [tokens, user] = await this.authService.updateLocal(dto, user42);
			await Promise.all([
				res.cookie("userData", JSON.stringify({ user }), { httpOnly: false }),
				this.authService.syncTokensHttpOnly(res, tokens),
			]);
			res.end()
		}
	
		// tahaTODO  nickname update  

	@Public()
	@Post("local/signin")
	@HttpCode(HttpStatus.OK)
	async signinLocal(@Body() dto: AuthDto, @Res() res: Response): Promise<any> {
		const tokens = await this.authService.signinLocal(dto);
		// console.log("hello");
		
		return (await this.authService.syncTokensHttpOnly(res, tokens)).end();
	}

	@Public()
	@Get("intra/login")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard("intra"))
	@Redirect("http://localhost:3001/")
	intraLogin(@Body() user: any) {
		console.log("first");
		return { helllo: "hello" };
	}
	

	// taha to do re refactor
	@Get("callback_42")
	@Public()
	@UseGuards(AuthGuard("intra"))
	async handleCallback(@GetUser() userdto: AuthIntraDto, @Res() res: Response): Promise<void> {
		try {
			const [token, signUpstate] = await this.authService.handle_intra(userdto);
			const userData = { ...(await this.usersService.getUser42(userdto.user42)), signUpstate };

			await Promise.all([
				res.cookie("userData", JSON.stringify({ userData }), { httpOnly: false }),
				this.authService.syncTokensHttpOnly(res, token),
			]);
			// const windowRef = window;
			

			res.redirect("http://localhost:3000/loading");
		} catch (error) {
			console.error("Error in handleCallback:", error);
			res.status(500).send("Internal Server Error");
		}
	}

	
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUser("user42") user42: string, @Res() res: Response): Promise<boolean> {
		return this.authService.logout(user42, res);
	}

	@Post("hello")
	@HttpCode(HttpStatus.OK)
	hello(@GetCurrentUser() papylod: any) {
		// console.log(papylod);
		return { hello: "hello" };
	}

	@Public()
	@UseGuards(RtGuard)
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	async refreshTokens(
		@GetCurrentUserId() userId: number,
		@GetCurrentUser("refreshToken") refreshToken: string,
		@Res() res: Response,
	): Promise<void> {
		console.log("refresh    ", refreshToken);
		const tokens = await this.authService.refreshTokens(userId, refreshToken, res);
		(await this.authService.syncTokensHttpOnly(res, tokens)).end();
	}
}
