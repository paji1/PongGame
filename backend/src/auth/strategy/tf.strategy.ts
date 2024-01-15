import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadTwoFa } from "../types";
import { Request as RequestType } from "express";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "jwt-twoFa") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				FtStrategy.extractJWT,
				// ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: config.get<string>("FT_SECRET"),
		});
	}

	private static extractJWT(req: RequestType | any): string | null {
		if (req.cookies && "ftToken" in req.cookies && req.cookies.ftToken?.length > 0) {
			return req.cookies.ftToken;
		}
		if (
			req.request &&
			req.request.headers.cookie &&
			req.request.headers.cookie.search("ftToken") != -1 &&
			req.request.headers.cookie.length > 0
		) {
			const on = req.request.headers.cookie.split("; ")[0].replace("=", ":");
			return on.split(":")[1];
		}
		throw new UnauthorizedException();

		return null;
	}

	validate(payload: JwtPayloadTwoFa) {
		return payload;
	}
}
