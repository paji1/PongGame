import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Res, HttpStatus } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { GetCurrentUser, GetCurrentUserId, Public } from "src/common/decorators";
import { AtGuard } from "src/common/guards";

@Controller("profile")
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get("user/:id")
	async findOne(@Param("id") id: string) {

		return await this.profileService.findOne(id);
	}

	@Get("friendship/:id")
	async handleGet(@GetCurrentUserId() id: number, @Param("id") friend: number, @Res() res: Response) {
		if (Number.isNaN(friend))
			throw new HttpException("Bad id", HttpStatus.FORBIDDEN)
		await this.profileService.getFriendship(id, +friend);
	}

	@Patch("updateStatus")
	async update(@GetCurrentUserId() id: number, @Body() status: UpdateProfileDto) {
		return await this.profileService.update(id, status);
	
	}

	@Get(":id/achieved")
	async getachieved(@Param("id") nick:string ) {

		return await this.profileService.getmyachivments(nick)
	}

	@Get(":id/GamingHistory")
	async getData(@Param("id") id: number) {
		if (Number.isNaN(id))
			throw new HttpException("id not defined", 404);
		return this.profileService.getGamingData(id);
	}


	@Get(":id/GLadder")
	async getGBoard(nickname: string) {
		return await this.profileService.getGlobalBoard(nickname);
	}

	@Get(":id/FLadder")
	async getFBoard(@GetCurrentUserId() id: number) {
		return await this.profileService.getFriendships(id);
	}
}
