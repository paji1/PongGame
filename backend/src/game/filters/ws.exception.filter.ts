import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { Socket } from "dgram";

@Catch(HttpException)
export class WsValidationExeption extends BaseWsExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const response = exception["response"]["message"];
		const socket = host.switchToWs();
		const client: Socket = socket.getClient();
		client.emit("game_error", response[0]);
	}
}
