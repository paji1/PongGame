import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";
import { ValidationPipe } from "@nestjs/common";
declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
	await app.listen(8001);

	// if (module.hot) {
	//   module.hot.accept();
	//   module.hot.dispose(() => app.close());
	// }
}
bootstrap();
