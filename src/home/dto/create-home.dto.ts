import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateHomeDto {
  @ApiProperty({
    description: 'Địa chỉ căn hộ',
    example: '286 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'ID của chủ nhà',
    example: '665b1c2f8f1b2a001e6e7a10',
  })
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

  @ApiPropertyOptional({ description: 'Tỉnh/Thành phố', example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Tòa nhà',
    example: 'Keangnam Landmark 72',
  })
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

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Căn hộ view đẹp, đầy đủ nội thất',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'Danh sách hình ảnh căn hộ',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  // Apartment amenities - Tiện ích căn hộ
  @ApiPropertyOptional({ description: 'Có phòng tắm', default: false })
  @IsOptional()
  @IsBoolean()
  hasBathroom?: boolean;

  @ApiPropertyOptional({ description: 'Có phòng ngủ', default: false })
  @IsOptional()
  @IsBoolean()
  hasBedroom?: boolean;

  @ApiPropertyOptional({ description: 'Có ban công', default: false })
  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  @ApiPropertyOptional({ description: 'Có nhà bếp', default: false })
  @IsOptional()
  @IsBoolean()
  hasKitchen?: boolean;

  @ApiPropertyOptional({ description: 'Có Wifi', default: false })
  @IsOptional()
  @IsBoolean()
  hasWifi?: boolean;

  @ApiPropertyOptional({ description: 'Có chống tiếng ồn', default: false })
  @IsOptional()
  @IsBoolean()
  hasSoundproof?: boolean;

  @ApiPropertyOptional({ description: 'Có điều hòa', default: false })
  @IsOptional()
  @IsBoolean()
  hasAirConditioner?: boolean;

  @ApiPropertyOptional({ description: 'Có máy giặt', default: false })
  @IsOptional()
  @IsBoolean()
  hasWashingMachine?: boolean;

  @ApiPropertyOptional({ description: 'Có tủ lạnh', default: false })
  @IsOptional()
  @IsBoolean()
  hasRefrigerator?: boolean;

  @ApiPropertyOptional({ description: 'Có thang máy', default: false })
  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean;

  @ApiPropertyOptional({ description: 'Có chỗ đậu xe', default: false })
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiPropertyOptional({ description: 'Có an ninh 24/7', default: false })
  @IsOptional()
  @IsBoolean()
  hasSecurity?: boolean;

  @ApiPropertyOptional({ description: 'Có phòng gym', default: false })
  @IsOptional()
  @IsBoolean()
  hasGym?: boolean;

  @ApiPropertyOptional({ description: 'Có hồ bơi', default: false })
  @IsOptional()
  @IsBoolean()
  hasSwimmingPool?: boolean;

  @ApiPropertyOptional({ description: 'Có khu vườn', default: false })
  @IsOptional()
  @IsBoolean()
  hasGarden?: boolean;

  @ApiPropertyOptional({
    description: 'Cho phép nuôi thú cưng',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasPetAllowed?: boolean;
}
