import { Body, Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { http } from 'winston';
import { fileTypeFromBuffer } from 'file-type';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post("")
  @UseInterceptors(FileInterceptor("IMAGE"))
  async updateImage(@GetCurrentUserId() id: number , @UploadedFile() file: Express.Multer.File)
  {
    if (file.size > 1000000)
      throw new HttpException("file exxeds 1mb in size", HttpStatus.BAD_REQUEST);
    
    console.log(await fileTypeFromBuffer(file.buffer))
   throw new HttpException("file exxeds 1mb in size", HttpStatus.AMBIGUOUS);
  }
}

