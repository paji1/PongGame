import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../../auth/types";

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): number => {
	const request = context.switchToHttp().getRequest();
	const user = request.user as JwtPayload;
	if (!user)
		return -1;
	return user.sub;
});
