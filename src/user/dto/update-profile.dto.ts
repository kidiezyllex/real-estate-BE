import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    name: 'name',
    description: 'Tên của người dùng',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    name: 'age',
    description: 'Tuổi của người dùng',
    example: 25,
    required: false,
  })
  age?: number;
} 