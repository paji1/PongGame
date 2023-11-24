import { userDto } from "./dto";
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Get,
	Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Public, GetCurrentUserId, GetCurrentUser } from "../common/decorators";
import { RtGuard } from "../common/guards";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { Response } from "express";
import { retry } from "rxjs";
import { blockFormDto } from "Dto/chat.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

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

	@Public()
	@Post("local/signup")
	@HttpCode(HttpStatus.CREATED)
	signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signupLocal(dto);
	}

	@Public()
	@Post("local/signin")
	@HttpCode(HttpStatus.OK)
	async signinLocal(
		@Body() dto: AuthDto,
		@Res() res: Response,
	): Promise<void> {
		const tokens = await this.authService.signinLocal(dto);
		console.log(tokens);
		// Set the tokens in an HTTP-only cookie
		const minute: number = 60000;
		res.cookie("atToken", tokens.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Set to true in production for secure cookies over HTTPS
			maxAge: 15 * minute, // Adjust the expiration time as needed
			path: "/",
		});

		res.cookie("rtToken", tokens.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * minute * 24 * 7,
			path: "/",
		});

		// You can also send the tokens in the response body if needed
		res.end();
	}

	@Public()
	@Get("intra/login")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard("intra"))
	intraLogin(@Body() user: any) {}

	@Get("callback_42")
	@Public()
	@UseGuards(AuthGuard("intra"))
	handleCallback() {
		// return
		// Handle the authorization code (e.g., exchange it for an access token)
		// console.log("req:", Req);
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(
		@GetCurrentUser("user42") user42: string,
		@Res() res: Response,
	): Promise<boolean> {
		
		return this.authService.logout(user42, res);
		
		
	}

	@Post("hello")
	@HttpCode(HttpStatus.OK)
	hello() {
		return { hello: "hello" };
	}

	@Public()
	@UseGuards(RtGuard)
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	refreshTokens(
		@GetCurrentUserId() userId: number,
		@GetCurrentUser("refreshToken") refreshToken: string,
	): Promise<Tokens> {
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
