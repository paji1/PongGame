import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class RtGuard extends AuthGuard("jwt-refresh") {
	constructor() {
		// console.log("at rtguard")

		super();
	}
	canActivate(context: ExecutionContext) {

		const res = context.switchToHttp().getResponse();
		return super.canActivate(context);
	}
	
}
