import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Tên dịch vụ', example: 'Dịch vụ bảo trì thang máy' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Đơn vị tính', example: 'Lần/quý' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Mô tả dịch vụ', example: 'Bảo trì, kiểm tra thang máy định kỳ mỗi quý cho tòa nhà' })
  @IsOptional()
  @IsString()
  description?: string;
} 