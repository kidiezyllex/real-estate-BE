import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Tên dịch vụ', example: 'Dịch vụ vệ sinh' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Đơn vị tính', example: 'Lần/tháng' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Mô tả dịch vụ', example: 'Dịch vụ vệ sinh hàng tháng cho căn hộ' })
  @IsOptional()
  @IsString()
  description?: string;
} 