import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ description: 'Họ tên khách hàng', example: 'Nguyễn Văn B' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Số điện thoại khách hàng',
    example: '0912345678',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'Email khách hàng',
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Số CMND/CCCD của khách hàng',
    example: '012345678901',
  })
  @IsOptional()
  @IsString()
  citizenId?: string;

  @ApiPropertyOptional({
    description: 'Ngày cấp CMND/CCCD',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDateString()
  citizen_date?: string;

  @ApiPropertyOptional({ description: 'Nơi cấp CMND/CCCD', example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  citizen_place?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ description: 'Quê quán', example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  hometown?: string;

  @ApiPropertyOptional({
    description: 'Giới tính (true: Nam, false: Nữ)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách hàng mới' })
  @IsOptional()
  @IsString()
  note?: string;
}
