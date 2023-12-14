import { ForbiddenException, Injectable, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

import { AuthDto, AuthIntraDto } from "./dto";
import { JwtPayload, Tokens } from "./types";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
	) {}

	async signupLocal(dto: AuthDto): Promise<Tokens> {
		const hash = await argon.hash(dto.password);
		const user = await this.prisma.user
			.create({
				data: {
					user42: dto.user42,
					nickname: dto.user42,
					hash,
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

		return tokens;
	}

	async handle_intra(dto: AuthIntraDto): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				user42: dto.user42,
			},
		});
		if (!user) return await this.signUpIntra(dto);
		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);

		return tokens;
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

		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);
		return tokens;
	}

	async signinLocal(dto: AuthDto): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				user42: dto.user42,
			},
		});

		if (!user) throw new ForbiddenException("Access Denied");

		const passwordMatches = await argon.verify(user.hash, dto.password);
		if (!passwordMatches) throw new ForbiddenException("Access Denied");

		const tokens = await this.getTokens(user.id, user.user42);
		await this.updateRtHash(user.id, tokens.refresh_token);

		return tokens;
	}

	async logout(user42: string, @Res() res: Response): Promise<boolean> {
		console.log("user42", user42);
		res.cookie("atToken", "", { expires: new Date(Date.now()) });
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

	async refreshTokens(userId: number, rt: string): Promise<Tokens> {
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

		return tokens;
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
	async syncTokensHttpOnly(res: Response, tokens: Tokens): Promise<Response> {
		const minute: number = 60000;
		res.cookie("atToken", tokens.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * minute,
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
}
