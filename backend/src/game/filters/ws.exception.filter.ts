import { ArgumentsHost, Catch, HttpException, UnauthorizedException } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { Socket } from "dgram";

@Catch(HttpException, UnauthorizedException)
export class WsValidationExeption extends BaseWsExceptionFilter {
	catch(exception: HttpException | UnauthorizedException, host: ArgumentsHost) {
		const response = exception["response"]["message"];
		const socket = host.switchToWs();
		const client: Socket = socket.getClient();
		client.emit("game_error", response);
	}
}
