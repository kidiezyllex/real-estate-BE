import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateInvoicePaymentDto {
  @ApiPropertyOptional({
    description: 'ID của căn hộ (bắt buộc nếu không có homeContractId hoặc serviceContractId)',
    example: '665b1c2f8f1b2a001e6e7a30',
  })
  @ValidateIf((o) => !o.homeContractId && !o.serviceContractId)
  @IsNotEmpty()
  @IsMongoId()
  homeId?: Types.ObjectId;

  @ApiProperty({
    description: 'Loại hóa đơn (1: Tiền thuê nhà, 2: Tiền dịch vụ)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  type: number;

  @ApiPropertyOptional({
    description: 'ID của hợp đồng nhà',
    example: '665b1c2f8f1b2a001e6e7a40',
  })
  @IsOptional()
  @IsMongoId()
  homeContractId?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'ID của hợp đồng dịch vụ',
    example: '665b1c2f8f1b2a001e6e7a50',
  })
  @IsOptional()
  @IsMongoId()
  serviceContractId?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'ID của người nhận',
    example: '665b1c2f8f1b2a001e6e7a60',
  })
  @IsOptional()
  @IsMongoId()
  receiverId?: Types.ObjectId;

  @ApiPropertyOptional({ 
    description: 'Ngày bắt đầu (tự động tính nếu không cung cấp)', 
    example: '2024-07-01' 
  })
  @IsOptional()
  @IsDateString()
  dateStar?: string;

  @ApiPropertyOptional({ 
    description: 'Ngày kết thúc (tự động tính nếu không cung cấp)', 
    example: '2024-10-01' 
  })
  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @ApiPropertyOptional({
    description: 'Ngày nhắc thanh toán',
    example: '2024-09-25',
  })
  @IsOptional()
  @IsDateString()
  datePaymentRemind?: string;

  @ApiPropertyOptional({
    description: 'Ngày dự kiến thanh toán',
    example: '2024-10-01',
  })
  @IsOptional()
  @IsDateString()
  datePaymentExpec?: string;

  @ApiPropertyOptional({
    description: 'Ngày thực tế thanh toán',
    example: '2024-10-01',
  })
  @IsOptional()
  @IsDateString()
  datePaymentReal?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái thanh toán (0: Chưa thanh toán, 1: Đã thanh toán)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  statusPaym?: number;

  @ApiPropertyOptional({ description: 'Tổng tiền nhận', example: 1000000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalReceive?: number;

  @ApiPropertyOptional({ description: 'Tổng tiền gửi', example: 1000000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalSend?: number;

  @ApiPropertyOptional({ 
    description: 'Ghi chú', 
    example: 'Tiền nhà tháng 6' 
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class GeneratePaymentDto {
  @ApiProperty({
    description: 'Ngày bắt đầu chu kỳ thanh toán',
    example: '2025-06-20',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Ngày kết thúc chu kỳ thanh toán',
    example: '2025-07-20',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Chu kỳ thanh toán (tháng)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  paymentCycle: number;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 200000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;
}
