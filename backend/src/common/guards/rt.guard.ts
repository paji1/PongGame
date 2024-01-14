import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

export class RtGuard extends AuthGuard("jwt-refresh") {
	constructor(private reflector: Reflector) {
		// console.log("at rtguard")

		super();
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		const res: Response = context.switchToHttp().getResponse();
		// const request = context.switchToHttp().getRequest();
		if (err || !user) {
			res.cookie("atToken", "", { expires: new Date(Date.now()) });
			res.cookie("rtToken", "", { expires: new Date(Date.now()) });

			throw err || new UnauthorizedException();
		}

		return user;
	}

	canActivate(context: ExecutionContext) {
		console.log("taha");
		return super.canActivate(context);
	}
}
