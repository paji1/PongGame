import { HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {

	constructor(readonly prisma: PrismaService) { }

	async create(createGameDto: CreateGameDto) {

		if (createGameDto.player1 === createGameDto.player2)
			throw new HttpException(`The same player cannot have a match with themselves.`, 401)
		
		const res = await this.prisma.matchhistory.create({
			data: {
				id: createGameDto.id,
				player1: createGameDto.player1,
				player2: createGameDto.player2,
				mode: createGameDto.game_mode
			}
		})
		return res
	}

	async findAll() {
		return await this.prisma.matchhistory.findMany({})
	}

	async findOne(id: string) {
		return await this.prisma.matchhistory.findUnique({
			where: {
				id: id
			}
		})
	}

	async findByUserId(userId: number) {
		return await this.prisma.matchhistory.findMany({
            where: {
                player1: userId
            }
        })
	}

	async update(id: string, updateGameDto: UpdateGameDto) {

		

		return await this.prisma.matchhistory.update({
			where: { id: id },
            data: {
				score1: updateGameDto.score1,
				score2: updateGameDto.score2,
				state: updateGameDto.state
			}
		})
		// this.map[id] = updateGameDto.state;
	}

	async remove(id: string) {
		return await this.prisma.matchhistory.delete({
			where: { id: id }
		})
	}
}
