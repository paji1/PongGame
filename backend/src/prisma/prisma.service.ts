import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			// log: ["error", "info", "query", "warn"],
		});
	}
	async onModuleInit() {
		await this.$connect();
		this.setAllofline()
	}



	async setAllofline()
	{
		
		try
		{
			await this.user.updateMany({
				data:{
					connection_state: "OFFLINE",
				}
			})

		}catch (e)
		{
			
			// const migrate  = await exec("npx prisma migrate dev --name init --schema='/code/prisma/schema.prisma'")
			const migrate  = await exec("bash /code/prisma/seed/seed.sh")
		}
	}
}
