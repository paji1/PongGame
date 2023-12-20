import { ArgumentsHost, BadRequestException, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch(HttpException)
export class WsValidationExeption extends BaseWsExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		// Here you have the exception and you can check the data
		console.log("WsValidationExeption");
		const response = exception["response"]["message"];
		const jj = host.switchToWs();
		const kk:  any= jj.getClient();
		kk.emit("error", response);
	}
}
