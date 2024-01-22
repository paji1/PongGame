// oauth.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-oauth2";
import { PrismaClient, user } from "@prisma/client";
import { AuthService } from "../auth.service";
import { AuthIntraDto } from "../dto";
import { ConfigService } from "@nestjs/config";


const conf: ConfigService = new ConfigService()
@Injectable()
export class intraStrategy extends PassportStrategy(Strategy, "intra") {
	constructor(private readonly authservise: AuthService) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: conf.get<string>("clientID"),
			clientSecret: conf.get<string>("clientSecret"),
			callbackURL: conf.get<string>("callbackURL")
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
		try {
			const userResponse = await fetch("https://api.intra.42.fr/v2/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
				.then((userResponse) => {
					if (!userResponse.ok) {
						throw new Error(`Failed to fetch user details: ${userResponse.statusText}`);
					}
					return userResponse.json();
				})
				.then((user) => {
					let dtoIntra: AuthIntraDto = {
						user42: user.login,
						nickname: user.login,
						avatar: user.image.link,
					};
					user.dtoIntra = dtoIntra;
					return done(null, user.dtoIntra);
				})
				.catch((error) => {
					console.error("Error during validation:", error);
					return done(error, false);
				});
		} catch (error) {
			console.error("Error during validation:", error);
			return done(error, false);
		}
	}
}
