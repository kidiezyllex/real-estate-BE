import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiverDto {
  @ApiProperty({ description: 'Tên người nhận', example: 'Nguyễn Văn C' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0912345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Mã số thuế', example: '0123456789' })
  @IsOptional()
  @IsString()
  taxcode?: string;

  @ApiPropertyOptional({ description: 'Tên tài khoản ngân hàng', example: 'NGUYEN VAN C' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ description: 'Số tài khoản ngân hàng', example: '0123456789' })
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional({ description: 'Tên ngân hàng', example: 'Vietcombank' })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional({ description: 'Loại người nhận (1: cá nhân, 2: tổ chức)', example: 1 })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Người nhận tiền thuê nhà' })
  @IsOptional()
  @IsString()
  note?: string;
} 