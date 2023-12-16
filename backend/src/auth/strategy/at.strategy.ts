import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { Request as RequestType } from "express";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				AtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: config.get<string>("AT_SECRET"),
		});
	}

	private static extractJWT(req: RequestType): string | null {
		if (req.cookies && "atToken" in req.cookies && req.cookies.atToken.length > 0) {
			return req.cookies.atToken;
		}
		return null;
	}
	
	validate(payload: JwtPayload) {
		
		return payload;
	}
}
