import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Thống kê')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('general')
  @ApiOperation({ summary: 'Thống kê tổng quan (số lượng căn hộ, khách hàng, chủ nhà, dịch vụ)' })
  getGeneralStatistics() {
    return this.statisticsService.getGeneralStatistics();
  }

  @Get('homes')
  @ApiOperation({ summary: 'Thống kê căn hộ (tổng số, đang cho thuê, đã thuê)' })
  getHomeStatistics() {
    return this.statisticsService.getHomeStatistics();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Thống kê doanh thu theo tháng trong năm' })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2023 })
  getRevenueByMonth(@Query('year') year: string) {
    return this.statisticsService.getRevenueByMonth(parseInt(year));
  }

  @Get('contracts')
  @ApiOperation({ summary: 'Thống kê hợp đồng (tổng số, hợp đồng nhà, hợp đồng dịch vụ, đang hoạt động)' })
  getContractsStatistics() {
    return this.statisticsService.getContractsStatistics();
  }

  @Get('payments')
  @ApiOperation({ summary: 'Thống kê thanh toán (tổng số, đúng hạn, trễ hạn)' })
  getPaymentStatistics() {
    return this.statisticsService.getPaymentStatistics();
  }

  @Get('due-payments')
  @ApiOperation({ summary: 'Thống kê thanh toán sắp đến hạn trong 7 ngày tới' })
  getDuePaymentsStatistics() {
    return this.statisticsService.getDuePaymentsStatistics();
  }
} 