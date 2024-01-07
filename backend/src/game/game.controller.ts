import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

	@Post()
	async create(@Body() createGameDto: CreateGameDto, @Res() response): Promise<CreateGameDto>{

		try {
			const res = await this.gameService.create(createGameDto);
			return response.status(200).json(res)
		} catch (error) {
			return response.status(error.status).json(error)
		}
	}

	@Get()
	async findAll() {
		return await this.gameService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const game = await this.gameService.findOne(id);
		return game
	}

	@Get(':userId')
	async findByUserId(@Param('userId') userId: number) {
        const games = await this.gameService.findByUserId(userId);
        return games
    }

	@Patch(':id')

	update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(id, updateGameDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.gameService.remove(id);
	}
}
