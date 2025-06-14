import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'The email of the user',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'The password of the user',
    required: true,
  })
  password: string;
}
