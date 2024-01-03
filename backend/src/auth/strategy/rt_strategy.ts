import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload, JwtPayloadWithRt } from "../types";
import { Request as RequestType } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				RtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: config.get<string>("RT_SECRET"),
			passReqToCallback: true,
		});
	}

	private static extractJWT(req: RequestType): string | null {
		if (
		  req.cookies &&
		  'rtToken' in req.cookies &&
		  req.cookies.rtToken.length > 0
		) {
		  return req.cookies.rtToken;
		}
		return null;
	}

	validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
		const refreshToken = req?.cookies?.rtToken;
		if (!refreshToken) throw new ForbiddenException("Refresh token malformed");
		
		return {
			...payload,
			refreshToken,
		};
	}
}
