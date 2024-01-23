import { ArgumentsHost, BadRequestException, Catch, HttpException, UnauthorizedException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "dgram";

@Catch(HttpException, UnauthorizedException)
export class WsValidationExeption extends BaseWsExceptionFilter {
	catch(exception: HttpException | UnauthorizedException, host: ArgumentsHost) {
		// Here you have the exception and you can check the data
		const response = exception["response"]["message"];
		const jj = host.switchToWs();
		const kk: Socket = jj.getClient();
		kk.emit("error", response);
	}
}
