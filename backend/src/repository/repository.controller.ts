import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path'
import { Response } from 'express';


@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}



  @Post("")
  @UseInterceptors(FileInterceptor("IMAGE") )
  async updateImage(@GetCurrentUser('user42') user: string , @UploadedFile() file: Express.Multer.File)
  {
    if (!file)
      throw new HttpException("No file", HttpStatus.BAD_GATEWAY);
    await this.repositoryService.uploadfile(file, user)
  }



  @Get("/:user/:filename")
  getimage(@Param("user") user:string, @Param("filename") file: string, @Res() response: Response )
  {
    const sublocation = user
    const filename = file
    const name = `/code/FileRepository/${sublocation}/` + filename
    
    if (!fs.existsSync(name))
      throw new HttpException("File Doesnt exist", HttpStatus.BAD_GATEWAY);
    response.sendFile(name)
  }
}

