// oauth.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-oauth2";
import { PrismaClient, user } from "@prisma/client";
import { AuthService } from "../auth.service";
import { AuthIntraDto } from "../dto";

@Injectable()
export class intraStrategy extends PassportStrategy(Strategy, "intra") {
	constructor(private readonly authservise: AuthService) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: "u-s4t2ud-4ed62b02a826e47295dc20d04afe8c7f303fc11eb571fb4fa36227730e99e0ca",
			clientSecret: "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",
			callbackURL: "http://localhost:3001/auth/callback_42",
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
					// console.log(userResponse);
					return userResponse.json();
				})
				.then((user) => {
					let dtoIntra: AuthIntraDto = {
						user42: user.login,
						nickname: user.login,
						avatar: user.image.link,
					};
					// console.log("Fetched User Details:", dtoIntra);
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
