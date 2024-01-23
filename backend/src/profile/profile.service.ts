import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProfileService {
	constructor(private readonly prisma: PrismaService) {}

	create(createProfileDto: CreateProfileDto) {
		return "This action adds a new profile";
	}

	findAll() {
		return `This action returns all profile`;
	}

	async findOne(username: string) {
		const data = await this.prisma.user.findFirst({
			select: {
				id: true,
				avatar: true,
				status: true,
				nickname: true,
				user42: true,
				connection_state: true,
				experience_points: true,
			},
			where: {
				nickname: username,
			},
		});
		console.log("data",data);
		if (!data) throw new HttpException("failed to fetch user", HttpStatus.BAD_REQUEST);
		return data;
	}

	async update(id: number, updateProfileDto: UpdateProfileDto) {
		const update = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				status: updateProfileDto.status,
			},
			select: {
				id: true,
				avatar: true,
				status: true,
				nickname: true,
				user42: true,
				connection_state: true,
				experience_points: true,
			},
		});
		return update;
	}

	async getFriendship(id: number, friend: number) {
		const user = await this.prisma.friendship.findFirst({
			where: {
				OR: [
					{
						initiator: id,
						reciever: friend,
					},
					{
						initiator: friend,
						reciever: id,
					},
				],
			},
		});
		if (user) throw new HttpException("ok", 200);
		else throw new HttpException("not ok", 201);
	}

	async getGlobalBoard(username: string) {
		const data = await this.prisma.user.findMany({
			select: {
				nickname: true,
				experience_points: true,
				avatar: true,
			},
			orderBy: {
				experience_points: "desc",
			},
		});
		return data;
	}

	async getFriendships(id: number) {
		const friendship = (
			await this.prisma.friendship.findMany({
				where: {
					OR: [
						{
							initiator: id,
						},
						{
							reciever: id,
						},
					],
				},
				select: {
					initiator_id: {
						select: {
							id: true,
							avatar: true,
							nickname: true,
							status: true,
							experience_points: true,
						},
					},
					reciever_id: {
						select: {
							id: true,
							avatar: true,
							nickname: true,
							status: true,
							experience_points: true,
						},
					},
				},
			})
		).map((friend) => (friend.initiator_id.id === id ? friend.reciever_id : friend.initiator_id));
		const blocked = (
			await this.prisma.friendship.findMany({
				where: {
					status: {
						not: "DEFAULT",
					},
					OR: [
						{
							initiator: id,
						},
						{
							reciever: id,
						},
					],
				},
			})
		).map((blockrel) => (blockrel.initiator === id ? blockrel.reciever : blockrel.initiator));
		const friends = friendship.filter((us) => !blocked.includes(us.id));
		const user = await this.prisma.user.findFirst({
			select: {
				id: true,
				avatar: true,
				status: true,
				nickname: true,
				experience_points: true,
			},
			where: {
				id: id,
			},
		});
		friends.push(user);
		return friends.slice().sort((a, b) => b.experience_points - a.experience_points);
	}
	async getGamingData(id: number) {
		const data = await this.prisma.matchhistory.findMany(
			{
				where: {
					OR:[
						{
							player1:id,
						},
						{
							player2:id,
						}
					]
			},
			select:
			{
				player1_id: 
				{
					select:
					{
						id:true,
						nickname: true,
						avatar:true,

					}
				
				},
				player2_id: 
				{
					select:
					{
						id:true,
						nickname: true,
						avatar:true,

					}
				
				},
				winner_id:true,
				loser_id:true,
				score1:true,
				score2: true,
				created_at:true,
			}
			
		})
		
		return data;
	}
	async getmyachivments(user:string)
	{
		return (await this.prisma.user.findUnique({where:{nickname:user},
				select:{
					achieved:{
						select:{
							index:true
						}
					}
				}
				})).achieved.map((achived)=> achived.index);
	}
}
