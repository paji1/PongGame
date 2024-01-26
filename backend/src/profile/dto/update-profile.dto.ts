import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
	@IsString()
	@MaxLength(700)
	@MinLength(100)
	status:string
}
