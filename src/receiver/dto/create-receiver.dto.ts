import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReceiverDto {
  @ApiProperty({ description: 'Tên người nhận', example: 'Phạm Minh Tuấn' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0911222333' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'tuan.pham@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Mã số thuế', example: '0101234567' })
  @IsOptional()
  @IsString()
  taxcode?: string;

  @ApiPropertyOptional({
    description: 'Tên tài khoản ngân hàng',
    example: 'PHAM MINH TUAN',
  })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({
    description: 'Số tài khoản ngân hàng',
    example: '19001234567890',
  })
  @IsOptional()
  @IsString()
  bankNumber?: string;

  @ApiPropertyOptional({
    description: 'Tên ngân hàng',
    example: 'Ngân hàng TMCP Kỹ thương Việt Nam',
  })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional({
    description: 'Loại người nhận (1: cá nhân, 2: tổ chức)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Người nhận tiền dịch vụ vệ sinh',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
