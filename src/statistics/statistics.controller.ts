import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Thống kê')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('general')
  @ApiOperation({
    summary:
      'Thống kê tổng quan (số lượng căn hộ, khách hàng, chủ nhà, dịch vụ)',
  })
  getGeneralStatistics() {
    return this.statisticsService.getGeneralStatistics();
  }

  @Get('homes')
  @ApiOperation({
    summary: 'Thống kê căn hộ (tổng số, đang cho thuê, đã thuê)',
  })
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
  @ApiOperation({
    summary:
      'Thống kê hợp đồng (tổng số, hợp đồng nhà, hợp đồng dịch vụ, đang hoạt động)',
  })
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

  // ===== BAR CHARTS =====
  @Get('charts/bar/revenue-monthly')
  @ApiOperation({ 
    summary: 'Bar Chart: Doanh thu theo tháng (phù hợp cho shadcn/ui Bar Chart)',
    description: 'Trả về dữ liệu doanh thu theo tháng định dạng cho Bar Chart'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getRevenueBarChart(@Query('year') year: string) {
    return this.statisticsService.getRevenueBarChart(parseInt(year));
  }

  @Get('charts/bar/contracts-comparison')
  @ApiOperation({ 
    summary: 'Bar Chart: So sánh số lượng hợp đồng nhà và dịch vụ theo tháng',
    description: 'Trả về dữ liệu so sánh hợp đồng nhà vs dịch vụ theo tháng'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getContractsComparisonBarChart(@Query('year') year: string) {
    return this.statisticsService.getContractsComparisonBarChart(parseInt(year));
  }

  @Get('charts/bar/payment-status')
  @ApiOperation({ 
    summary: 'Bar Chart: Thống kê trạng thái thanh toán theo tháng',
    description: 'Trả về dữ liệu thanh toán đúng hạn vs trễ hạn theo tháng'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getPaymentStatusBarChart(@Query('year') year: string) {
    return this.statisticsService.getPaymentStatusBarChart(parseInt(year));
  }

  // ===== LINE CHARTS =====
  @Get('charts/line/revenue-trend')
  @ApiOperation({ 
    summary: 'Line Chart: Xu hướng doanh thu theo tháng (phù hợp cho shadcn/ui Line Chart)',
    description: 'Trả về dữ liệu xu hướng doanh thu định dạng cho Line Chart'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getRevenueTrendLineChart(@Query('year') year: string) {
    return this.statisticsService.getRevenueTrendLineChart(parseInt(year));
  }

  @Get('charts/line/homes-occupancy')
  @ApiOperation({ 
    summary: 'Line Chart: Xu hướng tỷ lệ lấp đầy căn hộ theo tháng',
    description: 'Trả về dữ liệu tỷ lệ căn hộ được thuê theo thời gian'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getHomesOccupancyLineChart(@Query('year') year: string) {
    return this.statisticsService.getHomesOccupancyLineChart(parseInt(year));
  }

  @Get('charts/line/contracts-growth')
  @ApiOperation({ 
    summary: 'Line Chart: Xu hướng tăng trưởng số lượng hợp đồng',
    description: 'Trả về dữ liệu tăng trưởng hợp đồng theo thời gian'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getContractsGrowthLineChart(@Query('year') year: string) {
    return this.statisticsService.getContractsGrowthLineChart(parseInt(year));
  }

  @Get('charts/line/payments-monthly')
  @ApiOperation({ 
    summary: 'Line Chart: Các đợt thanh toán theo tháng',
    description: 'Trả về dữ liệu số lượng thanh toán theo tháng'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getPaymentsMonthlyLineChart(@Query('year') year: string) {
    return this.statisticsService.getPaymentsMonthlyLineChart(parseInt(year));
  }

  // ===== PIE CHARTS =====
  @Get('charts/pie/homes-rental-status')
  @ApiOperation({ 
    summary: 'Pie Chart: Phân bố căn hộ đã thuê và chưa cho thuê',
    description: 'Trả về dữ liệu phân bố căn hộ theo trạng thái cho thuê'
  })
  getHomesRentalStatusPieChart() {
    return this.statisticsService.getHomesRentalStatusPieChart();
  }

  @Get('charts/pie/homes-status')
  @ApiOperation({ 
    summary: 'Pie Chart: Phân bố trạng thái căn hộ (phù hợp cho shadcn/ui Pie Chart)',
    description: 'Trả về dữ liệu phân bố trạng thái căn hộ định dạng cho Pie Chart'
  })
  getHomesStatusPieChart() {
    return this.statisticsService.getHomesStatusPieChart();
  }

  @Get('charts/pie/contracts-distribution')
  @ApiOperation({ 
    summary: 'Pie Chart: Phân bố loại hợp đồng (nhà vs dịch vụ)',
    description: 'Trả về dữ liệu phân bố hợp đồng nhà và dịch vụ'
  })
  getContractsDistributionPieChart() {
    return this.statisticsService.getContractsDistributionPieChart();
  }

  @Get('charts/pie/payment-methods')
  @ApiOperation({ 
    summary: 'Pie Chart: Phân bố phương thức thanh toán',
    description: 'Trả về dữ liệu phân bố các phương thức thanh toán'
  })
  getPaymentMethodsPieChart() {
    return this.statisticsService.getPaymentMethodsPieChart();
  }

  @Get('charts/pie/revenue-sources')
  @ApiOperation({ 
    summary: 'Pie Chart: Phân bố nguồn doanh thu (từ nhà vs dịch vụ)',
    description: 'Trả về dữ liệu phân bố doanh thu theo nguồn'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024 })
  getRevenueSourcesPieChart(@Query('year') year: string) {
    return this.statisticsService.getRevenueSourcesPieChart(parseInt(year));
  }

  // ===== DASHBOARD OVERVIEW =====
  @Get('dashboard/overview')
  @ApiOperation({ 
    summary: 'Dashboard Overview: Tổng hợp tất cả thống kê chính cho dashboard',
    description: 'Trả về dữ liệu tổng hợp cho trang dashboard chính'
  })
  @ApiQuery({ name: 'year', description: 'Năm thống kê', example: 2024, required: false })
  getDashboardOverview(@Query('year') year?: string) {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    return this.statisticsService.getDashboardOverview(targetYear);
  }
}
