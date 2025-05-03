import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateHomeContractDto {
  @ApiProperty({ description: 'ID của khách hàng', example: '665b1c2f8f1b2a001e6e7a20' })
  @IsNotEmpty()
  @IsMongoId()
  guestId: Types.ObjectId;

  @ApiProperty({ description: 'ID của căn hộ', example: '665b1c2f8f1b2a001e6e7a30' })
  @IsNotEmpty()
  @IsMongoId()
  homeId: Types.ObjectId;

  @ApiProperty({ description: 'Thời hạn hợp đồng (tháng)', example: 24 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({ description: 'Chu kỳ thanh toán (tháng)', example: 6 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  payCycle: number;

  @ApiProperty({ description: 'Giá thuê (VND)', example: 15000000 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  renta: number;

  @ApiProperty({ description: 'Ngày bắt đầu hợp đồng', example: '2024-07-01' })
  @IsNotEmpty()
  @IsDateString()
  dateStar: string;

  @ApiPropertyOptional({ description: 'Tiền đặt cọc (VND)', example: 20000000 })
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