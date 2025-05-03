import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateHomeDto {
  @ApiProperty({ description: 'Địa chỉ căn hộ', example: '286 Hoàng Quốc Việt, Cầu Giấy, Hà Nội' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'ID của chủ nhà', example: '665b1c2f8f1b2a001e6e7a10' })
  @IsNotEmpty()
  @IsMongoId()
  homeOwnerId: Types.ObjectId;

  @ApiPropertyOptional({ description: 'Quận/Huyện', example: 'Nam Từ Liêm' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Phường/Xã', example: 'Mỹ Đình 1' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ description: 'Tòa nhà', example: 'Keangnam Landmark 72' })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional({ description: 'Căn hộ số', example: 'B2208' })
  @IsOptional()
  @IsString()
  apartmentNv?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Căn hộ view đẹp, đầy đủ nội thất' })
  @IsOptional()
  @IsString()
  note?: string;
} 