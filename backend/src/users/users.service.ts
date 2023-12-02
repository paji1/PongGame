import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"; // Assuming you have a Prisma service
import { user } from "@prisma/client";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findOne(username: string): Promise<user | null> {
		return this.prisma.user.findUnique({
			where: {
				user42: username,
			},
		});
	}
	//   async validate_user()
}
