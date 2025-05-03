import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInvoicePaymentDto {
  @ApiProperty({ description: 'ID của căn hộ', example: '665b1c2f8f1b2a001e6e7a30' })
  @IsNotEmpty()
  @IsMongoId()
  homeId: Types.ObjectId;

  @ApiProperty({ description: 'Loại hóa đơn (1: Tiền thuê nhà, 2: Tiền dịch vụ)', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  type: number;

  @ApiPropertyOptional({ description: 'ID của hợp đồng nhà', example: '665b1c2f8f1b2a001e6e7a40' })
  @IsOptional()
  @IsMongoId()
  homeContractId?: Types.ObjectId;

  @ApiPropertyOptional({ description: 'ID của hợp đồng dịch vụ', example: '665b1c2f8f1b2a001e6e7a50' })
  @IsOptional()
  @IsMongoId()
  serviceContractId?: Types.ObjectId;

  @ApiPropertyOptional({ description: 'ID của người nhận', example: '665b1c2f8f1b2a001e6e7a60' })
  @IsOptional()
  @IsMongoId()
  receiverId?: Types.ObjectId;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2024-07-01' })
  @IsNotEmpty()
  @IsDateString()
  dateStar: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2024-10-01' })
  @IsNotEmpty()
  @IsDateString()
  dateEnd: string;

  @ApiPropertyOptional({ description: 'Ngày nhắc thanh toán', example: '2024-09-25' })
  @IsOptional()
  @IsDateString()
  datePaymentRemind?: string;

  @ApiPropertyOptional({ description: 'Ngày dự kiến thanh toán', example: '2024-10-01' })
  @IsOptional()
  @IsDateString()
  datePaymentExpec?: string;

  @ApiPropertyOptional({ description: 'Ngày thực tế thanh toán', example: '2024-10-01' })
  @IsOptional()
  @IsDateString()
  datePaymentReal?: string;

  @ApiPropertyOptional({ description: 'Trạng thái thanh toán (1: Chưa thanh toán, 2: Đã thanh toán)', example: 2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  statusPaym?: number;

  @ApiPropertyOptional({ description: 'Tổng tiền nhận', example: 12000000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalReceive?: number;

  @ApiPropertyOptional({ description: 'Tổng tiền gửi', example: 11500000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalSend?: number;
} 