import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateServiceContractDto {
  @ApiProperty({ description: 'ID của dịch vụ', example: '665b1c2f8f1b2a001e6e7a70' })
  @IsNotEmpty()
  @IsMongoId()
  serviceId: Types.ObjectId;

  @ApiProperty({ description: 'ID của căn hộ', example: '665b1c2f8f1b2a001e6e7a30' })
  @IsNotEmpty()
  @IsMongoId()
  homeId: Types.ObjectId;

  @ApiProperty({ description: 'ID của khách hàng', example: '665b1c2f8f1b2a001e6e7a20' })
  @IsNotEmpty()
  @IsMongoId()
  guestId: Types.ObjectId;

  @ApiPropertyOptional({ description: 'ID của hợp đồng thuê nhà', example: '665b1c2f8f1b2a001e6e7a40' })
  @IsOptional()
  @IsMongoId()
  homeContractStk?: Types.ObjectId;

  @ApiProperty({ description: 'Ngày ký hợp đồng', example: '2024-07-01' })
  @IsNotEmpty()
  @IsDateString()
  signDate: string;

  @ApiProperty({ description: 'Chu kỳ thanh toán (tháng)', example: 12 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  payCycle: number;

  @ApiProperty({ description: 'Thời hạn hợp đồng (tháng)', example: 36 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({ description: 'Giá dịch vụ', example: 2500000 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  unitCost: number;

  @ApiProperty({ description: 'Ngày bắt đầu hợp đồng', example: '2024-07-01' })
  @IsNotEmpty()
  @IsDateString()
  dateStar: string;

  @ApiProperty({ description: 'Ngày kết thúc hợp đồng', example: '2027-07-01' })
  @IsNotEmpty()
  @IsDateString()
  dateEnd: string;

  @ApiPropertyOptional({ description: 'Trạng thái hợp đồng (1: Đang hiệu lực, 2: Hết hạn, 3: Đã hủy)', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  statusContrac?: number;

  @ApiPropertyOptional({ description: 'Giới hạn số lần sử dụng (0: không giới hạn)', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
} 