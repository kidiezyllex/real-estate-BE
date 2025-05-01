import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateHomeContractDto {
  @ApiProperty({ description: 'ID của khách hàng', example: '60d21b4667d0d8992e610c85' })
  @IsNotEmpty()
  @IsMongoId()
  guestId: Types.ObjectId;

  @ApiProperty({ description: 'ID của căn hộ', example: '60d21b4667d0d8992e610c86' })
  @IsNotEmpty()
  @IsMongoId()
  homeId: Types.ObjectId;

  @ApiProperty({ description: 'Thời hạn hợp đồng (tháng)', example: 12 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({ description: 'Chu kỳ thanh toán (tháng)', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  payCycle: number;

  @ApiProperty({ description: 'Giá thuê (VND)', example: 10000000 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  renta: number;

  @ApiProperty({ description: 'Ngày bắt đầu hợp đồng', example: '2023-01-01' })
  @IsNotEmpty()
  @IsDateString()
  dateStar: string;

  @ApiPropertyOptional({ description: 'Tiền đặt cọc (VND)', example: 10000000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deposit?: number;

  @ApiPropertyOptional({ description: 'Trạng thái hợp đồng (1: Đang hiệu lực, 2: Hết hạn, 3: Đã hủy)', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
} 