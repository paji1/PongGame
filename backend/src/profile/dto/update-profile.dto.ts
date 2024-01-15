import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsString } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
	@IsString()
	status:string
}
