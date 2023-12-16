import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";
import { ValidationPipe } from "@nestjs/common";
// import { Logger } from '@nestjs/common';
import * as winston from "winston";
import * as cookieParser from "cookie-parser";

// declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		origin: [
		  'http://10.12.7.4:3000',
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
