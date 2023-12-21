import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"; // Assuming you have a Prisma service
import { user } from "@prisma/client";
import { http } from "winston";

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
	async getuser(user:number)
	{
		const data = await this.prisma.user.findUnique({where:{id:user}
		,
		select:
		{
			id:true,
			user42:true,
			nickname:true,
			avatar:true,
			status:true,
		}
		})
		if (!data)
			throw new HttpException("failed to fetch user", HttpStatus.BAD_REQUEST);
		return data;
	}
	//   async validate_user()



	async getusersbyname(name:string)
	{
		return await this.prisma.user.findMany({
			where:
			{
				nickname : {contains : name},
				
			},
			select:
			{
				id:true,
				nickname:true,
				user42:true,
				avatar:true,
			}
		})
	}
}
