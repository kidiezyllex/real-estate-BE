import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeOwnerDto } from './create-home-owner.dto';

export class UpdateHomeOwnerDto extends PartialType(CreateHomeOwnerDto) {} 