import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			// log: ["error", "info", "query", "warn"],
		});
	}
	async onModuleInit() {
		await this.$connect();
		console.log("connect prisma");
	await this.user.updateMany({
		data:{
			connection_state: "OFFLINE",
		}
	})
	}
}
