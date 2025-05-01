import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeContractDto } from './create-home-contract.dto';

export class UpdateHomeContractDto extends PartialType(CreateHomeContractDto) {} 