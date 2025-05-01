import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateHomeDto {
  @ApiProperty({ description: 'Địa chỉ căn hộ', example: '123 Đường ABC, Quận XYZ' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'ID của chủ nhà', example: '60d21b4667d0d8992e610c85' })
  @IsNotEmpty()
  @IsMongoId()
  homeOwnerId: Types.ObjectId;

  @ApiPropertyOptional({ description: 'Quận/Huyện', example: 'Cầu Giấy' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Phường/Xã', example: 'Dịch Vọng' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ description: 'Tòa nhà', example: 'Golden Palace' })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional({ description: 'Căn hộ số', example: 'A1205' })
  @IsOptional()
  @IsString()
  apartmentNv?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Căn hộ cao cấp' })
  @IsOptional()
  @IsString()
  note?: string;
} 