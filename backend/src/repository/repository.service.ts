import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';


const typechecker = require("fix-esm").require("file-type");
const allowed  = [
  "png",
  "gif",
  "jpg",
]
const conf: ConfigService = new ConfigService()

const url = `http://${conf.get<string>("ip")}:3001/repository/`



@Injectable()
export class RepositoryService {
    constructor(private readonly prisma: PrismaService)
    {
    
    }


    async uploadfile(file : Express.Multer.File , user : string)
    {
        if (file.size > 1000000)
            throw new HttpException("file exeeds 1mb in size", HttpStatus.BAD_REQUEST);

        const type = await typechecker.fileTypeFromBuffer(file.buffer)

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
          const files = fs.readdirSync(`./${location}/${user}`)
          files.map((file, index) =>  {
            console.log(`./${location}/${user}/${filename}`, file, index)
            if (file !== filename)
                fs.unlinkSync(`./${location}/${user}/${file}`)
            return "dd"
        })
          console.log(files)
          await this.prisma.user.update({
            where:{
                user42: user,
            },
            data:
            {
                avatar: url + sublocation + "/" + filename,
            }
          })
        }
        catch (err){
         throw new HttpException("Server: Error writing file", HttpStatus.BAD_GATEWAY)
        }
        throw new HttpException(url + sublocation + "/" + filename, HttpStatus.ACCEPTED);
    }
}
