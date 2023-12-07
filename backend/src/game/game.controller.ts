import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameUpdateGuard } from 'src/common/guards/game-update/game-update.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

	@Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gameService.create(createGameDto);
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
	@UseGuards(GameUpdateGuard)
	update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(id, updateGameDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.gameService.remove(id);
	}
}
