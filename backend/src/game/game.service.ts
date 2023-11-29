import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) { }
  async create(createGameDto: CreateGameDto) {
	
	
    return await this.prisma.matchhistory.create({
		data: {
			player1: createGameDto.player1,
            player2: createGameDto.player2,
			mode: createGameDto.game_mode
		}
	})
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
