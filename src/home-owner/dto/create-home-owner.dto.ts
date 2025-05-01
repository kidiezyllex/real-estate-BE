import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateHomeOwnerDto {
  @ApiProperty({ description: 'Họ tên chủ nhà', example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'Số điện thoại chủ nhà', example: '0912345678' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Email chủ nhà', example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Số CMND/CCCD của chủ nhà', example: '012345678901' })
  @IsOptional()
  @IsString()
  citizenId?: string;

  @ApiPropertyOptional({ description: 'Ngày cấp CMND/CCCD', example: '2020-01-01' })
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

  @ApiPropertyOptional({ description: 'Tên ngân hàng', example: 'Vietcombank' })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional({ description: 'Tên tài khoản ngân hàng', example: 'NGUYEN VAN A' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ description: 'Số tài khoản ngân hàng', example: '0123456789' })
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Chủ nhà quan trọng' })
  @IsOptional()
  @IsString()
  note?: string;
} 