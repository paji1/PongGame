import { AuthIntraDto, AuthSignUp, UpdatePassDto, userDto } from "./dto";
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Get,
	Res,
	Req,
	Redirect,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Public, GetCurrentUserId, GetCurrentUser, GetUser } from "../common/decorators";
import { ItGuard, RtGuard } from "../common/guards";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { Response, Request } from "express";
import { retry } from "rxjs";
import * as path from "path";
import { UsersService } from "src/users/users.service";
import { get } from "http";
import { TwoFactorAuthService } from "./two-factor-auth/two-factor-auth.service";
import { TwoFaAuthDto } from "./dto/twoFa.dto";
import { FtGuard } from "src/common/guards/ft.guard";
import { UpdateNicknameDto } from "./dto/updateNickname.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
	) {}


	@Public()
	@UseGuards(ItGuard)
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
			res.cookie("itToken", "", { expires: new Date(Date.now()) }),
		]);
		res.end();
	}

	// tahaTODO password update
	@Post("local/apdate/password")
	@HttpCode(HttpStatus.OK)
	async updatePassword(
		@Body() dto: UpdatePassDto,
		@Res() res: Response,
		@GetCurrentUser("user42") user42: string,
	): Promise<void> {
		const tokens = await this.authService.updatepassword(dto, user42);
		await this.authService.syncTokensHttpOnly(res, tokens), res.end();
	}
	
	@HttpCode(HttpStatus.OK)
	@Post("local/apdate/nickname")
	async updatedNickname(@Body() dto : UpdateNicknameDto,  @GetCurrentUser("user42") user42: string, @Res() res : Response) : Promise<any>  
	{
		return await this.authService.updateNickname(dto,user42,res);
		
	}



	// tahaTODO  nickname update

	@Public()
	@UseGuards(ItGuard)
	@Post("local/signin")
	@HttpCode(HttpStatus.OK)
	async signinLocal(
		@Body() dto: AuthDto,
		@Res() res: Response,
		@GetCurrentUser("user42") user42: string,
	): Promise<any> {
		// try {

		if (dto.user42 !== user42) throw new UnauthorizedException();
		const tokens = await this.authService.signinLocal(dto);
		if ((await this.twoFactorAuthService.isTwoFacActiveh(user42)).is2FA)
			return this.authService.handle2fa(user42, res);
		const userData = { ...(await this.usersService.getUser42(dto.user42)), signUpstate: true };
		await Promise.all([
			res.cookie("userData", JSON.stringify({ userData }), { httpOnly: false }),
			this.authService.syncTokensHttpOnly(res, tokens),
			// res.cookie("itToken", "", { expires: new Date(Date.now()) }),
		]);

		res.end();
	}
	@UseGuards(FtGuard)
	@Public()
	@Post("local/signinTwofa")
	@HttpCode(HttpStatus.OK)
	async signin2fA(
		@Body() dto: TwoFaAuthDto,
		@Res() res: Response,
		@GetCurrentUser("user42") user42: string,
	): Promise<any> {
		return await this.twoFactorAuthService.signin2fA(user42, res, dto);
	}

	@Public()
	@Get("intra/login")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard("intra"))
	@Redirect("http://lghoul.ddns.net:3001/")
	intraLogin(@Body() user: any) {
		return {};
	}

	// taha to do re refactor
	@HttpCode(HttpStatus.OK)
	@Get("callback_42")
	@Public()
	@UseGuards(AuthGuard("intra"))
	async handleCallback(@GetUser() userdto: AuthIntraDto, @Res() res: Response): Promise<void> {
		return await this.authService.handle__callback(userdto, res);
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUser("user42") user42: string, @Res() res: Response): Promise<boolean> {
		return this.authService.logout(user42, res);
	}

	@Post("hello")
	@HttpCode(HttpStatus.OK)
	hello(@GetCurrentUser() papylod: any) {
		return { hello: "hello" };
	}

	@UseGuards(RtGuard)
	@Post("refresh")
	@Public()
	@HttpCode(HttpStatus.OK)
	async refreshTokens(
		@GetCurrentUserId() userId: number,
		@GetCurrentUser("refreshToken") refreshToken: string,
		@GetCurrentUser("user42") user42: string,
		@Res() res: Response,
	): Promise<void> {
		const [tokens, signUpstate] = await this.authService.refreshTokens(userId, refreshToken, res);
		

		const userData = await { ...(await this.usersService.getUser42(user42)), signUpstate };
		await Promise.all([
			res.cookie("userData", JSON.stringify({ userData }), { httpOnly: false }),
			this.authService.syncTokensHttpOnly(res, tokens),
		]);

		res.end();
	}

	@Post("generateQrCode")
	async generateQrCode(@Res() response: Response, @GetCurrentUser("user42") user42: string) {
		response.setHeader("content-type", "image/png");
		const { otpAuthUrl } = await this.twoFactorAuthService.genereteSecret(user42);
		return await this.twoFactorAuthService.qrCodeStreamPipe(response, otpAuthUrl);
	}

	@Post("checkValidcode")
	async checkIfvalid(@Body() dto: TwoFaAuthDto, @GetCurrentUser("user42") user42: string) {
		await this.twoFactorAuthService.checkIfValidCode(dto, user42);
	}
	@Post("disable2fa")
	async disable2fa(@Body() dto: any, @GetCurrentUser("user42") user42: string) {
		await this.twoFactorAuthService.activeTwoFactorAuth(user42, false);
	}
	@Get("is2fa")
	async is2fa(@GetCurrentUser("user42") user42: string) : Promise<{is2FA: Boolean}>{
		return await this.twoFactorAuthService.isTwoFacActiveh(user42);
	}
}
