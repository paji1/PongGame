import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Injectable()
export class ItGuard extends AuthGuard("jwt-intra") {
	constructor(private reflector: Reflector) {
		super();
	}
	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		const res: Response = context.switchToHttp().getResponse();

		if (user) {
			const request = context.switchToHttp().getRequest();
			request.isIntra = true
		}
		
		return user;
	}
	
	canActivate(context: ExecutionContext) {
		console.log("mouhajir")
		return super.canActivate(context);
	}
}