import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { user } from "@prisma/client";
import { Response } from "express";
import { TwoFaAuthDto } from "../dto/twoFa.dto";

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private authService: AuthService,
		private readonly usersService: UsersService,
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
	) {}
	async genereteSecret(user42: string): Promise<{secret : string , otpAuthUrl: string} | null> {
		const user: user = await this.prisma.user.findUnique({
			where: {
				user42: user42,
			},
		});

		if (user.is2FA) {
			return null;
		}

		const secret: string = authenticator.generateSecret();
		const appName: string = "wladnass";
		const otpAuthUrl: string = authenticator.keyuri(appName, user42, secret);
		await this.prisma.user.update({
			where: {
				user42: user42,
			},
			data: {
				secret2FA: secret,
			},
		});
		
		return {secret, otpAuthUrl};
	}

	async verify2facode(code: string, userSecret : string) : Promise<boolean>
	{
		return await  authenticator.verify({token : code, secret : userSecret}); 
	}

	async qrCodeStreamPipe(stream : Response, otpAuthUrl : string)
	{
		return await toFileStream(stream, otpAuthUrl);
	}


	async checkIfValidCode(dto : TwoFaAuthDto,  user42 : string) : Promise<any>
	{
		const user : user = await this.usersService.findOne(user42);
		const valid =  await this.verify2facode(dto.code, user.secret2FA);
		if (!valid)
		{
			throw new UnauthorizedException("code is not valid");  
		}
		return this.activeTwoFactorAuth(user42, true);
	}

	async activeTwoFactorAuth(user42: string, status : boolean):  Promise<user>
	{
		return await this.prisma.user.update({
			where: {
				user42: user42,
			},
			data: {
				is2FA: status,
			},
		});		
	}
	async isTwoFacActiveh(user42: string, ):  Promise<{is2FA:  boolean}>
	{
		return await this.prisma.user.findUnique({
			where: {
				user42: user42,
			},
			select: {
				is2FA : true,
			},
		});		
	}

	async signin2fA(user42 : string , res: Response, dto : TwoFaAuthDto )
	{
		try {

			const user : user = await this.checkIfValidCode(dto, user42); 
			if (!user)
				throw new UnauthorizedException("prisma error");
			const token =  await this.authService.getTokens(user.id, user42);
			const userData = { signUpstate: true, user: user42 };

			await Promise.all([
				res.cookie("userData", JSON.stringify({ userData }), { httpOnly: false }),
				this.authService.syncTokensHttpOnly(res, token),
			]);
			// const windowRef = window;
			return res;

		} catch (error) {
			console.error("Error in handleCallback:", error);
			res.status(500).send("Internal Server Error");
		}
		return res;
	}
}
