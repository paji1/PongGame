import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path'
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

const typechecker = require("fix-esm").require("file-type");
const allowed  = [
  "png",
  "gif",
  "png",
  "jpg",
]
const conf: ConfigService = new ConfigService()

const url = `http://${conf.get<string>("ip")}:3001/repository/`


@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post("")
  @UseInterceptors(FileInterceptor("IMAGE") )
  async updateImage(@GetCurrentUser('user42') user: number , @UploadedFile() file: Express.Multer.File)
  {
    if (!file)
    throw new HttpException("No file", HttpStatus.BAD_GATEWAY);

    if (file.size > 1000000)
      throw new HttpException("file exeeds 1mb in size", HttpStatus.BAD_REQUEST);
    console.log(file)
    const type = await typechecker.fileTypeFromBuffer(file.buffer)
    console.log(type)
    if (type === undefined || type.ext === undefined)
      throw new HttpException("file magic number not recognized", HttpStatus.BAD_REQUEST);

    if (type === undefined || !allowed.includes(type.ext))
          throw new HttpException("file type not allowed", HttpStatus.BAD_REQUEST);
    const location = "FileRepository"
    const sublocation = user
    const filename =  Date.now().toString() + "." + type.ext;

    const name = `./${location}/${user}/` + filename
    try
    {
      fs.mkdirSync(`./FileRepository/${user}/`,{ recursive: true });
      fs.writeFileSync(name, file.buffer);
    }
    catch (err){
     throw new HttpException("Server Error: writing file", HttpStatus.BAD_GATEWAY)
    }
    throw new HttpException(url + sublocation + "/" + filename, HttpStatus.ACCEPTED);
  }
  @Get("/:user/:filename")
  async getimage(@Param("user") user:string, @Param("filename") file: string, @Res() response: Response )
  {
    const location = "FileRepository"
    const sublocation = user
    const filename = file
    const name = `/code/FileRepository/${sublocation}/` + filename
    
    if (!fs.existsSync(name))
      throw new HttpException("File Doesnt exist", HttpStatus.BAD_GATEWAY);
    await response.sendFile(name)

  }
}

