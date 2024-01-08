// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { JwtPayload } from "../types";
// import { Request as RequestType } from "express";

// @Injectable()
// export class TwoFactorStrategy extends PassportStrategy(Strategy, "jwt-") {
// 	constructor(config: ConfigService) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromExtractors([
// 				TwoFactorStrategy.extractJWT,
// 				// ExtractJwt.fromAuthHeaderAsBearerToken(),
// 			]),
// 			secretOrKey: config.get<string>("AT_SECRET"),
// 		});
// 	}

// 	private static extractJWT(req: RequestType | any): string | null {
// 		if (req.cookies && "atToken" in req.cookies && req.cookies.atToken?.length > 0) {
// 			return req.cookies.atToken;
// 		}
// 		if (
// 			req.request &&
// 			req.request.headers.cookie &&
// 			req.request.headers.cookie.search("atToken") != -1 &&
// 			req.request.headers.cookie.length > 0
// 		) {
// 			const on = req.request.headers.cookie.split("; ")[0].replace("=", ":");
// 			return on.split(":")[1];
// 		}

// 		return null;
// 	}

// 	validate(payload: JwtPayload) {
// 		return payload;
// 	}
// }
