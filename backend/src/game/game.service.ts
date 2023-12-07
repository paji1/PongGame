import { Injectable, OnModuleInit, SetMetadata } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService implements OnModuleInit {

	constructor(readonly prisma: PrismaService) {  }

	machesState: Map<string, string>;

	async create(createGameDto: CreateGameDto) {
		return await this.prisma.matchhistory.create({
			data: {
				player1: createGameDto.player1,
                player2: createGameDto.player2,
                mode: createGameDto.game_mode
			}
		})
	}
	onModuleInit() {

		// this.machesState[]
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
		// check if game exist
		// if (this.map.)

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

  remove(id: string) {
    return `This action removes a #${id} game`;
  }
}
