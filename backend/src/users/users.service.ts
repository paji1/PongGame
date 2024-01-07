import { HttpException, HttpStatus, Injectable, Req, Res, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"; // Assuming you have a Prisma service
import { user } from "@prisma/client";
import { http } from "winston";
import { Contains } from "class-validator";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
	) {}

	async findOne(username: string): Promise<user | null> {
		return this.prisma.user.findUnique({
			where: {
				user42: username,
			},
		});
	}
	async getuser(user: number) {
		const data = await this.prisma.user.findUnique({
			where: { id: user },
			select: {
				id: true,
				user42: true,
				nickname: true,
				avatar: true,
				status: true,
			},
		});
		if (!data) throw new HttpException("failed to fetch user", HttpStatus.BAD_REQUEST);
		return data;
	}
	async getUser42(user42: string) {
		const data = await this.prisma.user.findUnique({
			where: { user42: user42 },
			select: {
				id: true,
				user42: true,
				nickname: true,
				avatar: true,
				status: true,
			},
		});
		if (!data) throw new HttpException("failed to fetch user", HttpStatus.BAD_REQUEST);
		return data;
	}
	//   async validate_user()

	async getusersbyname(user: number, name: string) {
		return await this.prisma.user.findMany({
			where: {
				nickname: { contains: name },
			},
			select: {
				id: true,
				nickname: true,
				user42: true,
				avatar: true,
				created_at: true,
			},
		});
	}

	async is_login(@Req() req: Request, @Res() res: Response): Promise<boolean> {
		if (!req.cookies.atToken) throw new UnauthorizedException();

		try {
			const payload: JwtPayload = await this.jwtService.verifyAsync(req.cookies.atToken, {
				secret: this.config.get<string>("AT_SECRET"),
			});
			const checkUserData: any = JSON.parse(req.cookies.userData)?.userData;
			if (checkUserData) {
				const user = await this.getuser(payload.sub);
				res.cookie("userData", JSON.stringify({ user }), { httpOnly: false });
			}
			if (checkUserData && checkUserData.user42 && payload.user42 !== checkUserData.user42) {
				const user = await this.getuser(payload.sub);
				res.cookie("userData", JSON.stringify({ user }), { httpOnly: false });
			}
			res.end();
			return true;
		} catch {
			throw new UnauthorizedException();
		}
	}
}

