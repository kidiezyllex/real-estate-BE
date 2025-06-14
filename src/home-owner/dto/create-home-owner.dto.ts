import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateHomeOwnerDto {
  @ApiProperty({ description: 'Họ tên chủ nhà', example: 'Trần Thị Bích Ngọc' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'Số điện thoại chủ nhà', example: '0987654321' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'Email chủ nhà',
    example: 'ngoc.tran@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Số CMND/CCCD của chủ nhà',
    example: '001234567890',
  })
  @IsOptional()
  @IsString()
  citizenId?: string;

  @ApiPropertyOptional({
    description: 'Ngày cấp CMND/CCCD',
    example: '2018-06-15',
  })
  @IsOptional()
  @IsDateString()
  citizen_date?: string;

  @ApiPropertyOptional({
    description: 'Nơi cấp CMND/CCCD',
    example: 'Cục Cảnh sát QLHC về TTXH',
  })
  @IsOptional()
  @IsString()
  citizen_place?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh', example: '1985-09-20' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({
    description: 'Tên ngân hàng',
    example: 'Ngân hàng TMCP Ngoại thương Việt Nam',
  })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional({
    description: 'Tên tài khoản ngân hàng',
    example: 'TRAN THI BICH NGOC',
  })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({
    description: 'Số tài khoản ngân hàng',
    example: '0451000123456',
  })
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Chủ nhà thân thiện, hợp tác tốt',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
