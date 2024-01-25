import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as fs from "fs";
const typechecker = require("fix-esm").require("file-type");

const allowed = ["png", "gif", "jpg"];

const conf: ConfigService = new ConfigService();
const url = `http://taha.redirectme.net:3001/repository/`;

@Injectable()
export class RepositoryService {
	constructor(private readonly prisma: PrismaService) {}

	async uploadfile(file: Express.Multer.File, user: string) {
		if (file.size > 5000000) throw new HttpException("file bigger than 5Mb in size", HttpStatus.BAD_REQUEST);

		const type = await typechecker.fileTypeFromBuffer(file.buffer);

		if (type === undefined || type.ext === undefined)
			throw new HttpException("file magic number not recognized", HttpStatus.BAD_REQUEST);

		if (!allowed.includes(type.ext)) throw new HttpException("file type not allowed", HttpStatus.BAD_REQUEST);
		const location = "FileRepository";
		const sublocation = user;
		const filename = Date.now().toString() + "." + type.ext;
		const name = `./${location}/${user}/` + filename;
		try {
			fs.mkdirSync(`./FileRepository/${user}/`, { recursive: true });
			fs.writeFileSync(name, file.buffer);
			await this.prisma.user.update({
				where: {
					user42: user,
				},
				data: {
					avatar: url + sublocation + "/" + filename,
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				fs.unlinkSync(`./${location}/${user}/${filename}`);
			}

			throw new HttpException("Server: Error writing file", 500);
		}

		const files = fs.readdirSync(`./${location}/${user}`);
		files.map((file, index) => {
			if (file !== filename) fs.unlinkSync(`./${location}/${user}/${file}`);
		});
		throw new HttpException(url + sublocation + "/" + filename, HttpStatus.ACCEPTED);
	}
}
