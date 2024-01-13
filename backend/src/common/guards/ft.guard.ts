import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Injectable()
export class FtGuard extends AuthGuard("jwt-twoFa") {
	constructor(private reflector: Reflector) {
		super();
	}
	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		const res: Response = context.switchToHttp().getResponse();

		if (user) {
			const request = context.switchToHttp().getRequest();
			request.isTwoFa = true
		}
		
		return user;
	}
	
	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}
}