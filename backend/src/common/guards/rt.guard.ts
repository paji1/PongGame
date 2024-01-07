import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

export class RtGuard extends AuthGuard("jwt-refresh") {
	constructor() {
		// console.log("at rtguard")

		super();
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		const res: Response = context.switchToHttp().getResponse();
		if (err || !user) {
			res.cookie("atToken", "", { expires: new Date(Date.now()) });
			res.cookie("rtToken", "", { expires: new Date(Date.now()) });
			res.cookie("userData", "", { expires: new Date(Date.now()) });
			throw err || new UnauthorizedException();
		}

		return user;
	}

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}
}
