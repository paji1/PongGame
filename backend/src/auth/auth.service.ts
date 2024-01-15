import { ForbiddenException, HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, user } from "@prisma/client";

import { AuthDto, AuthIntraDto, AuthSignUp, UpdatePassDto, userDatadto } from "./dto";
import { JwtPayload, JwtPayloadTwoFa, Tokens } from "./types";
import { Response } from "express";
import { find } from "rxjs";
import { use } from "passport";
import { UpdateNicknameDto } from "./dto/updateNickname.dto";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,

	) {}

	async updatepassword(dto: UpdatePassDto, user42: string): Promise<Tokens> {
		const user = await this.prisma.user
			.findUnique({
				where: {
					user42: user42,
				},
				select: {
					id: true,
					hash: true,
				},
			})
			.catch((error) => {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new ForbiddenException("Credentials incorrect");
					}
				}
				throw error;
			});
		const isAble: boolean = await argon.verify(user.hash, dto.currentPassword);
		if (!isAble) throw new UnauthorizedException();

		const newPassword: string = await argon.hash(dto.newPassword);
		await this.prisma.user
			.update({
				where: {
					user42: user42,
				},
				data: {
					hash: newPassword,
				},
			})
			.catch((error) => {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new ForbiddenException("Credentials incorrect");
					}
				}
				throw error;
			});
		const tokens = await this.getTokens(user.id, user42);
		await this.updateRtHash(user.id, tokens.refresh_token);
		return tokens;
	}


	async updateNickname(dto : UpdateNicknameDto , user42:string, res :  Response) : Promise<string>
	{
		try {
			const user  = await this.prisma.user.update({
				where: {
					user42 : user42,
				},
				data : {
					nickname : dto.newNickname,
				}
			})
			if (!user)
				throw new HttpException("error : prisma updateNickname ", HttpStatus.EXPECTATION_FAILED);
			res.cookie("userData", "", { expires: new Date(Date.now()) });
			res.end()
			return dto.newNickname;
		} catch (error) {
			throw new HttpException("error : prisma updateNickname ", HttpStatus.EXPECTATION_FAILED);
		}
	}

	async updateLocal(dto: AuthSignUp, user42: string): Promise<[Tokens, userDatadto]> {
		const hash = await argon.hash(dto.password);
		const user = await this.prisma.user
			.update({
				where: {
					user42: user42,
				},
				data: {
					nickname: dto.nickname,
					hash,
				},
				select: {
					id: true,
					user42: true,
					nickname: true,
					avatar: true,
					status: true,
				},
			})
			.catch((error) => {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new ForbiddenException("Credentials incorrect");
					}
				}
				throw error;
			});

		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);

		return [tokens, user];
	}

	async handle_intra(dto: AuthIntraDto): Promise<[Tokens, boolean, boolean]> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					user42: dto.user42,
				},
			});
			
			if (!user) return [await this.signUpIntra(dto), false, false];
			console.log("here");
			
			// const tokens = await this.getTokens(user.id, user.user42);
			// await this.updateRtHash(user.id, tokens.refresh_token);
			const intra_token = await this.getTokensIntra(user.id, user.user42);
			const tokens: Tokens = { access_token: "null", refresh_token: "null", intra_token: intra_token };
			
			return [tokens, !user.hash ? false : true, user.is2FA];
		} catch (error) {
			throw new HttpException("error signup", 402)
		}
	}
	async handle2fa(user42 : string , res : Response): Promise<any> {
		const token : string = await this.getTokenTwofa(user42);

		await this.syncTokensHttpOnly2fa(res, token);
		res.json({is2fa : true});
		return res;
	}


	async handle__callback(userdto: AuthIntraDto, res: Response) : Promise<void>
	{
		try {
			const [token, signUpstate, is2FA] = await this.handle_intra(userdto);
			const userData = { signUpstate, user: userdto.user42 };

			await Promise.all([
				res.cookie("userData", JSON.stringify({ userData }), { httpOnly: false }),
				this.syncTokensHttpOnlyIntra(res, token),
			]);
			// const windowRef = window;

			res.redirect("http://wladnas.ddns.net:3000/loading");
		} catch (error) {
			console.error("Error in handleCallback:", error);
			res.status(500).send("Internal Server Error");
		}
	}
	
	async signUpIntra(dto: AuthIntraDto): Promise<Tokens> {
		const user = await this.prisma.user
			.create({
				data: {
					user42: dto.user42,
					nickname: dto.nickname,
					avatar: dto.avatar,
				},
			})
			.catch((error) => {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new ForbiddenException("Credentials incorrect");
					}
				}
				throw error;
			});

		const intra_token = await this.getTokensIntra(user.id, user.user42);
		const tokens: Tokens = { access_token: "null", refresh_token: "null", intra_token: intra_token };
		return tokens;
	}

	async signinLocal(dto: AuthDto): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				user42: dto.user42,
			},
		});
		

		if (!user) throw new UnauthorizedException("Access Denied");
		
		const passwordMatches = await argon.verify(user.hash, dto.password);
		if (!passwordMatches) throw new UnauthorizedException("Access Denied");

		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);

		return tokens;
	}
	

	async logout(user42: string, @Res() res: Response): Promise<boolean> {
		res.cookie("atToken", "", { expires: new Date(Date.now()) });
		res.cookie("rtToken", "", { expires: new Date(Date.now()) });
		res.cookie("userData", "", { expires: new Date(Date.now()) });
		await this.prisma.user.updateMany({
			where: {
				user42: user42,
				hashedRt: {
					not: null,
				},
			},
			data: {
				hashedRt: null,
			},
		});
		res.end();

		return true;
	}

	async refreshTokens(userId: number, rt: string, res: Response): Promise<[Tokens,boolean]> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied");
		const rtMatches = await argon.verify(user.hashedRt, rt);
		if (!rtMatches) throw new ForbiddenException("Access Denied");


		
		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);
		return [tokens, (!user.hash ? false : true ) ];
	}

	async updateRtHash(userId: number, rt: string): Promise<void> {
		const hash = await argon.hash(rt);
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRt: hash,
			},
		});
	}

	async getTokens(userId: number, user42: string): Promise<Tokens> {
		const jwtPayload: JwtPayload = {
			sub: userId,
			user42: user42,
		};

		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: this.config.get<string>("AT_SECRET"),
				expiresIn: "15m",
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret: this.config.get<string>("RT_SECRET"),
				expiresIn: "7d",
			}),
		]);

		return {
			access_token: at,
			refresh_token: rt,
		};
	}
	async getTokensIntra(userId: number, user42: string): Promise<string> {
		const jwtPayload: JwtPayload = {
			sub: userId,
			user42: user42,
		};

		const it = await this.jwtService.signAsync(jwtPayload, {
			secret: this.config.get<string>("IT_SECRET"),
			expiresIn: "15m",
		});
		return it;
	}
	async getTokenTwofa( user42: string): Promise<string> {
		const jwtPayload: JwtPayloadTwoFa = {
			user42: user42,
		};

		const it = await this.jwtService.signAsync(jwtPayload, {
			secret: this.config.get<string>("FT_SECRET"),
			expiresIn: "15m",
		});
		return it;
	}

	async syncTokensHttpOnly(res: Response, tokens: Tokens): Promise<Response> {
		const minute: number = 60 * 1000;
		res.cookie("atToken", tokens.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 300 * minute,
			path: "/",
		});

		res.cookie("rtToken", tokens.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * minute * 24 * 7,
			path: "/",
		});

		return res;
	}
	async syncTokensHttpOnlyIntra(res: Response, tokens: Tokens): Promise<Response> {
		const minute: number = 60 * 1000;
		res.cookie("itToken", tokens.intra_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * minute,
			path: "/",
		});
		return res;
	}
	async syncTokensHttpOnly2fa(res: Response, token:string): Promise<Response> {
		const minute: number = 60 * 1000;
		res.cookie("ftToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * minute,
			path: "/",
		});
		return res;
	}





	async findunique(dto: AuthDto): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				user42: dto.user42,
			},
		});
		if (user) return true;
		return false;
	}
}
