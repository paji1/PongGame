import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";
import { ValidationPipe } from "@nestjs/common";
// import { Logger } from '@nestjs/common';
import * as winston from "winston";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";




// declare const module: any;
const conf: ConfigService = new ConfigService()
const ip = conf.get<string>("ip");
console.log("ip is: ", ip)
async function bootstrap() {
	
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		origin: [
		  `http://${ip}:3000`,
		  'http://localhost:3000'
		],
		methods: ["GET", "POST", "DELETE","PATCH" ],
		credentials: true,
	  });
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
	await app.listen(8001);
	const logger = winston.createLogger({
		level: "debug", // Set the log level here
		transports: [new winston.transports.Console()],
	});

	app.useLogger(logger);

	// if (module.hot) {
	//   module.hot.accept();
	//   module.hot.dispose(() => app.close());
	// }
}
bootstrap();
