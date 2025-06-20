import { Injectable } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoicePayment } from '../invoice-payment/schema/invoice-payment.schema';
import { HomeContract } from '../home-contract/schema/home-contract.schema';
import { ServiceContract } from '../service-contract/schema/service-contract.schema';
import { Home } from '../home/schema/home.schema';
import { Guest } from '../guest/schema/guest.schema';
import { HomeOwner } from '../home-owner/schema/home-owner.schema';
import { Service } from '../service/schema/service.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(InvoicePayment.name)
    private invoicePaymentModel: Model<InvoicePayment>,
    @InjectModel(HomeContract.name)
    private homeContractModel: Model<HomeContract>,
    @InjectModel(ServiceContract.name)
    private serviceContractModel: Model<ServiceContract>,
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(Guest.name) private guestModel: Model<Guest>,
    @InjectModel(HomeOwner.name) private homeOwnerModel: Model<HomeOwner>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  // Thống kê tổng số căn hộ, khách hàng, chủ nhà, dịch vụ
  async getGeneralStatistics(): Promise<ApiResponseType> {
    const [homesCount, guestsCount, homeOwnersCount, servicesCount] =
      await Promise.all([
        this.homeModel.countDocuments(),
        this.guestModel.countDocuments(),
        this.homeOwnerModel.countDocuments(),
        this.serviceModel.countDocuments(),
      ]);

    const data = {
      homesCount,
      guestsCount,
      homeOwnersCount,
      servicesCount,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê tổng quan thành công',
      data,
    });
  }

  // Thống kê số lượng căn hộ đang cho thuê và đã thuê
  async getHomeStatistics(): Promise<ApiResponseType> {
    const totalHomes = await this.homeModel.countDocuments({ active: true });
    const rentedHomes = await this.homeModel.countDocuments({ 
      homeContract: { $ne: null },
      active: true 
    }); // Căn hộ có hợp đồng = đã thuê
    const availableHomes = await this.homeModel.countDocuments({ 
      homeContract: null,
      active: true 
    }); // Căn hộ không có hợp đồng = đang cho thuê

    const data = {
      totalHomes,
      rentedHomes,
      availableHomes,
      rentedPercentage: totalHomes > 0 ? (rentedHomes / totalHomes) * 100 : 0,
      availablePercentage: totalHomes > 0 ? (availableHomes / totalHomes) * 100 : 0,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê căn hộ thành công',
      data,
    });
  }

  // Thống kê doanh thu theo tháng
  async getRevenueByMonth(year: number): Promise<ApiResponseType> {
    const result = await this.invoicePaymentModel.aggregate([
      {
        $match: {
          statusPaym: 2, // Đã thanh toán
          datePaymentReal: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$datePaymentReal' },
          total: { $sum: '$totalReceive' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Tạo mảng 12 tháng với doanh thu 0
    const monthlyRevenue = Array(12).fill(0);

    // Điền doanh thu vào các tháng tương ứng
    result.forEach((item) => {
      monthlyRevenue[item._id - 1] = item.total;
    });

    const data = {
      year,
      monthlyRevenue,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê doanh thu theo tháng thành công',
      data,
    });
  }

  async getContractsStatistics(): Promise<ApiResponseType> {
    const homeContracts = await this.homeContractModel.countDocuments();
    const serviceContracts = await this.serviceContractModel.countDocuments();

    // Sửa lỗi: HomeContract không có dateEnd, chỉ tính theo status = 1 (đang hoạt động)
    const activeHomeContracts = await this.homeContractModel.countDocuments({
      status: 1,
    });

    const activeServiceContracts =
      await this.serviceContractModel.countDocuments({
        dateEnd: { $gte: new Date() },
        statusContrac: 1,
      });

    const data = {
      totalContracts: homeContracts + serviceContracts,
      homeContracts,
      serviceContracts,
      activeHomeContracts,
      activeServiceContracts,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê hợp đồng thành công',
      data,
    });
  }

  // Thống kê số lượng thanh toán đúng hạn/trễ hạn
  async getPaymentStatistics(): Promise<ApiResponseType> {
    const totalPayments = await this.invoicePaymentModel.countDocuments({
      statusPaym: 2,
    }); // Đã thanh toán

    // Số lượng thanh toán đúng hạn (ngày thanh toán thực tế <= ngày dự kiến)
    const onTimePayments = await this.invoicePaymentModel.countDocuments({
      statusPaym: 2,
      $expr: { $lte: ['$datePaymentReal', '$datePaymentExpec'] },
    });

    // Số lượng thanh toán trễ hạn
    const latePayments = totalPayments - onTimePayments;

    const data = {
      totalPayments,
      onTimePayments,
      latePayments,
      onTimePercentage: (onTimePayments / totalPayments) * 100,
      latePercentage: (latePayments / totalPayments) * 100,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê thanh toán thành công',
      data,
    });
  }

  // Thống kê thanh toán sắp đến hạn trong 7 ngày tới
  async getDuePaymentsStatistics(): Promise<ApiResponseType> {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const duePayments = await this.invoicePaymentModel.countDocuments({
      datePaymentExpec: { $gte: now, $lte: sevenDaysLater },
      statusPaym: 1, // Chưa thanh toán
    });

    const totalDueAmount = await this.invoicePaymentModel.aggregate([
      {
        $match: {
          datePaymentExpec: { $gte: now, $lte: sevenDaysLater },
          statusPaym: 1,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalReceive' },
        },
      },
    ]);

    const data = {
      duePayments,
      totalDueAmount: totalDueAmount.length > 0 ? totalDueAmount[0].total : 0,
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thống kê thanh toán sắp đến hạn thành công',
      data,
    });
  }

  // ===== BAR CHARTS =====
  
  // Bar Chart: Doanh thu theo tháng
  async getRevenueBarChart(year: number): Promise<ApiResponseType> {
    const result = await this.invoicePaymentModel.aggregate([
      {
        $match: {
          statusPaym: 2, // Đã thanh toán
          datePaymentReal: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$datePaymentReal' },
          total: { $sum: '$totalReceive' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    // Tạo dữ liệu cho Bar Chart theo định dạng shadcn/ui
    const chartData = monthNames.map((month, index) => {
      const monthData = result.find(item => item._id === index + 1);
      return {
        month,
        revenue: monthData ? monthData.total : 0,
      };
    });

    const data = {
      year,
      chartData,
      config: {
        revenue: {
          label: 'Doanh thu (VNĐ)',
          color: 'hsl(var(--chart-1))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Bar Chart doanh thu thành công',
      data,
    });
  }

  // Bar Chart: So sánh hợp đồng nhà vs dịch vụ theo tháng
  async getContractsComparisonBarChart(year: number): Promise<ApiResponseType> {
    const [homeContractsData, serviceContractsData] = await Promise.all([
      this.homeContractModel.aggregate([
        {
          $match: {
            dateStar: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$dateStar' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      this.serviceContractModel.aggregate([
        {
          $match: {
            dateStar: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$dateStar' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const chartData = monthNames.map((month, index) => {
      const homeData = homeContractsData.find(item => item._id === index + 1);
      const serviceData = serviceContractsData.find(item => item._id === index + 1);
      
      return {
        month,
        homeContracts: homeData ? homeData.count : 0,
        serviceContracts: serviceData ? serviceData.count : 0,
      };
    });

    const data = {
      year,
      chartData,
      config: {
        homeContracts: {
          label: 'Hợp đồng nhà',
          color: 'hsl(var(--chart-1))',
        },
        serviceContracts: {
          label: 'Hợp đồng dịch vụ',
          color: 'hsl(var(--chart-2))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Bar Chart so sánh hợp đồng thành công',
      data,
    });
  }

  // Bar Chart: Trạng thái thanh toán theo tháng
  async getPaymentStatusBarChart(year: number): Promise<ApiResponseType> {
    const [onTimeData, lateData] = await Promise.all([
      this.invoicePaymentModel.aggregate([
        {
          $match: {
            statusPaym: 2,
            datePaymentReal: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
            $expr: { $lte: ['$datePaymentReal', '$datePaymentExpec'] },
          },
        },
        {
          $group: {
            _id: { $month: '$datePaymentReal' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      this.invoicePaymentModel.aggregate([
        {
          $match: {
            statusPaym: 2,
            datePaymentReal: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
            $expr: { $gt: ['$datePaymentReal', '$datePaymentExpec'] },
          },
        },
        {
          $group: {
            _id: { $month: '$datePaymentReal' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const chartData = monthNames.map((month, index) => {
      const onTime = onTimeData.find(item => item._id === index + 1);
      const late = lateData.find(item => item._id === index + 1);
      
      return {
        month,
        onTime: onTime ? onTime.count : 0,
        late: late ? late.count : 0,
      };
    });

    const data = {
      year,
      chartData,
      config: {
        onTime: {
          label: 'Đúng hạn',
          color: 'hsl(var(--chart-1))',
        },
        late: {
          label: 'Trễ hạn',
          color: 'hsl(var(--chart-2))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Bar Chart trạng thái thanh toán thành công',
      data,
    });
  }

  // ===== LINE CHARTS =====

  // Line Chart: Xu hướng doanh thu
  async getRevenueTrendLineChart(year: number): Promise<ApiResponseType> {
    const result = await this.invoicePaymentModel.aggregate([
      {
        $match: {
          statusPaym: 2,
          datePaymentReal: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$datePaymentReal' },
          total: { $sum: '$totalReceive' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const chartData = monthNames.map((month, index) => {
      const monthData = result.find(item => item._id === index + 1);
      return {
        month,
        revenue: monthData ? monthData.total : 0,
      };
    });

    const data = {
      year,
      chartData,
      config: {
        revenue: {
          label: 'Doanh thu (VNĐ)',
          color: 'hsl(var(--chart-1))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Line Chart xu hướng doanh thu thành công',
      data,
    });
  }

  // Line Chart: Tỷ lệ lấp đầy căn hộ
  async getHomesOccupancyLineChart(year: number): Promise<ApiResponseType> {
    // Giả sử chúng ta có dữ liệu theo tháng về tỷ lệ lấp đầy
    const totalHomes = await this.homeModel.countDocuments();
    
    const occupancyData = await this.homeContractModel.aggregate([
      {
        $match: {
          dateStart: { $lte: new Date(`${year}-12-31`) },
          $or: [
            { dateEnd: { $gte: new Date(`${year}-01-01`) } },
            { dateEnd: { $exists: false } }
          ],
        },
      },
      {
        $group: {
          _id: { $month: '$dateStart' },
          occupiedHomes: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const chartData = monthNames.map((month, index) => {
      const monthData = occupancyData.find(item => item._id === index + 1);
      const occupiedCount = monthData ? monthData.occupiedHomes : 0;
      const occupancyRate = totalHomes > 0 ? (occupiedCount / totalHomes) * 100 : 0;
      
      return {
        month,
        occupancyRate: Math.round(occupancyRate * 100) / 100, // Làm tròn 2 chữ số thập phân
      };
    });

    const data = {
      year,
      chartData,
      config: {
        occupancyRate: {
          label: 'Tỷ lệ lấp đầy (%)',
          color: 'hsl(var(--chart-1))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Line Chart tỷ lệ lấp đầy căn hộ thành công',
      data,
    });
  }

  // Line Chart: Tăng trưởng hợp đồng
  async getContractsGrowthLineChart(year: number): Promise<ApiResponseType> {
    const [homeGrowth, serviceGrowth] = await Promise.all([
      this.homeContractModel.aggregate([
        {
          $match: {
            dateStar: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$dateStar' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      this.serviceContractModel.aggregate([
        {
          $match: {
            dateStar: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$dateStar' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const chartData = monthNames.map((month, index) => {
      const homeData = homeGrowth.find(item => item._id === index + 1);
      const serviceData = serviceGrowth.find(item => item._id === index + 1);
      
      return {
        month,
        homeContracts: homeData ? homeData.count : 0,
        serviceContracts: serviceData ? serviceData.count : 0,
        total: (homeData ? homeData.count : 0) + (serviceData ? serviceData.count : 0),
      };
    });

    const data = {
      year,
      chartData,
      config: {
        homeContracts: {
          label: 'Hợp đồng nhà',
          color: 'hsl(var(--chart-1))',
        },
        serviceContracts: {
          label: 'Hợp đồng dịch vụ',
          color: 'hsl(var(--chart-2))',
        },
        total: {
          label: 'Tổng hợp đồng',
          color: 'hsl(var(--chart-3))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Line Chart tăng trưởng hợp đồng thành công',
      data,
    });
  }

  // ===== PIE CHARTS =====

  // Pie Chart: Trạng thái căn hộ
  async getHomesStatusPieChart(): Promise<ApiResponseType> {
    const [available, rented, inactive] = await Promise.all([
      this.homeModel.countDocuments({ 
        homeContract: null,
        active: true 
      }), // Đang cho thuê
      this.homeModel.countDocuments({ 
        homeContract: { $ne: null },
        active: true 
      }), // Đã thuê
      this.homeModel.countDocuments({ active: false }), // Không hoạt động
    ]);

    const chartData = [
      {
        status: 'Đang cho thuê',
        count: available,
        fill: 'hsl(var(--chart-1))',
      },
      {
        status: 'Đã thuê',
        count: rented,
        fill: 'hsl(var(--chart-2))',
      },
      {
        status: 'Không hoạt động',
        count: inactive,
        fill: 'hsl(var(--chart-3))',
      },
    ];

    const data = {
      chartData,
      config: {
        count: {
          label: 'Số lượng',
        },
        status: {
          label: 'Trạng thái',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Pie Chart trạng thái căn hộ thành công',
      data,
    });
  }

  // Pie Chart: Phân bố hợp đồng
  async getContractsDistributionPieChart(): Promise<ApiResponseType> {
    const [homeContracts, serviceContracts] = await Promise.all([
      this.homeContractModel.countDocuments(),
      this.serviceContractModel.countDocuments(),
    ]);

    const chartData = [
      {
        type: 'Hợp đồng nhà',
        count: homeContracts,
        fill: 'hsl(var(--chart-1))',
      },
      {
        type: 'Hợp đồng dịch vụ',
        count: serviceContracts,
        fill: 'hsl(var(--chart-2))',
      },
    ];

    const data = {
      chartData,
      config: {
        count: {
          label: 'Số lượng',
        },
        type: {
          label: 'Loại hợp đồng',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Pie Chart phân bố hợp đồng thành công',
      data,
    });
  }

  // Pie Chart: Phương thức thanh toán
  async getPaymentMethodsPieChart(): Promise<ApiResponseType> {
    // Giả sử có field paymentMethod trong invoice payment
    const paymentMethods = await this.invoicePaymentModel.aggregate([
      {
        $match: { statusPaym: 2 }, // Đã thanh toán
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
        },
      },
    ]);

    const methodNames = {
      1: 'Tiền mặt',
      2: 'Chuyển khoản',
      3: 'Ví điện tử',
      4: 'Thẻ tín dụng',
    };

    const chartData = paymentMethods.map((method, index) => ({
      method: methodNames[method._id] || 'Khác',
      count: method.count,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));

    const data = {
      chartData,
      config: {
        count: {
          label: 'Số lượng',
        },
        method: {
          label: 'Phương thức',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Pie Chart phương thức thanh toán thành công',
      data,
    });
  }

  // Pie Chart: Nguồn doanh thu
  async getRevenueSourcesPieChart(year: number): Promise<ApiResponseType> {
    // Giả sử có cách phân biệt doanh thu từ nhà và dịch vụ
    const [homeRevenue, serviceRevenue] = await Promise.all([
      this.invoicePaymentModel.aggregate([
        {
          $lookup: {
            from: 'homecontracts',
            localField: 'contractId',
            foreignField: '_id',
            as: 'homeContract',
          },
        },
        {
          $match: {
            statusPaym: 2,
            datePaymentReal: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
            homeContract: { $ne: [] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalReceive' },
          },
        },
      ]),
      this.invoicePaymentModel.aggregate([
        {
          $lookup: {
            from: 'servicecontracts',
            localField: 'contractId',
            foreignField: '_id',
            as: 'serviceContract',
          },
        },
        {
          $match: {
            statusPaym: 2,
            datePaymentReal: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
            serviceContract: { $ne: [] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalReceive' },
          },
        },
      ]),
    ]);

    const chartData = [
      {
        source: 'Doanh thu từ nhà',
        revenue: homeRevenue.length > 0 ? homeRevenue[0].total : 0,
        fill: 'hsl(var(--chart-1))',
      },
      {
        source: 'Doanh thu từ dịch vụ',
        revenue: serviceRevenue.length > 0 ? serviceRevenue[0].total : 0,
        fill: 'hsl(var(--chart-2))',
      },
    ];

    const data = {
      year,
      chartData,
      config: {
        revenue: {
          label: 'Doanh thu (VNĐ)',
        },
        source: {
          label: 'Nguồn doanh thu',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Pie Chart nguồn doanh thu thành công',
      data,
    });
  }

  // Pie Chart: Phân bố căn hộ đã thuê và chưa cho thuê
  async getHomesRentalStatusPieChart(): Promise<ApiResponseType> {
    const totalHomes = await this.homeModel.countDocuments({ active: true });
    const rentedHomes = await this.homeModel.countDocuments({ 
      homeContract: { $ne: null },
      active: true 
    });
    const availableHomes = await this.homeModel.countDocuments({ 
      homeContract: null,
      active: true 
    });

    const chartData = [
      {
        status: 'Đã cho thuê',
        count: rentedHomes,
        fill: 'hsl(var(--chart-1))',
      },
      {
        status: 'Chưa cho thuê',
        count: availableHomes,
        fill: 'hsl(var(--chart-2))',
      },
    ];

    const data = {
      totalHomes,
      chartData,
      config: {
        count: {
          label: 'Số lượng căn hộ',
        },
        status: {
          label: 'Trạng thái',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Pie Chart trạng thái cho thuê căn hộ thành công',
      data,
    });
  }

  // Line Chart: Các đợt thanh toán theo tháng
  async getPaymentsMonthlyLineChart(year: number): Promise<ApiResponseType> {
    const result = await this.invoicePaymentModel.aggregate([
      {
        $match: {
          datePaymentReal: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { 
            month: { $month: '$datePaymentReal' },
            status: '$statusPaym'
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1, '_id.status': 1 },
      },
    ]);

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    // Tạo dữ liệu cho Line Chart
    const chartData = monthNames.map((month, index) => {
      const monthIndex = index + 1;
      const paidPayments = result.find(item => item._id.month === monthIndex && item._id.status === 2);
      const unpaidPayments = result.find(item => item._id.month === monthIndex && item._id.status === 1);
      const overduePayments = result.find(item => item._id.month === monthIndex && item._id.status === 3);
      
      return {
        month,
        paid: paidPayments ? paidPayments.count : 0,
        unpaid: unpaidPayments ? unpaidPayments.count : 0,
        overdue: overduePayments ? overduePayments.count : 0,
        total: (paidPayments?.count || 0) + (unpaidPayments?.count || 0) + (overduePayments?.count || 0),
      };
    });

    const data = {
      year,
      chartData,
      config: {
        paid: {
          label: 'Đã thanh toán',
          color: 'hsl(var(--chart-1))',
        },
        unpaid: {
          label: 'Chưa thanh toán',
          color: 'hsl(var(--chart-2))',
        },
        overdue: {
          label: 'Quá hạn',
          color: 'hsl(var(--chart-3))',
        },
        total: {
          label: 'Tổng số đợt thanh toán',
          color: 'hsl(var(--chart-4))',
        },
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu Line Chart thanh toán theo tháng thành công',
      data,
    });
  }

  // ===== DASHBOARD OVERVIEW =====

  async getDashboardOverview(year: number): Promise<ApiResponseType> {
    const [
      generalStats,
      homeStats,
      contractStats,
      paymentStats,
      revenueChart,
      homesStatusPie,
    ] = await Promise.all([
      this.getGeneralStatistics(),
      this.getHomeStatistics(),
      this.getContractsStatistics(),
      this.getPaymentStatistics(),
      this.getRevenueBarChart(year),
      this.getHomesStatusPieChart(),
    ]);

    const data = {
      year,
      overview: {
        general: generalStats.data,
        homes: homeStats.data,
        contracts: contractStats.data,
        payments: paymentStats.data,
      },
      charts: {
        revenueChart: revenueChart.data,
        homesStatusPie: homesStatusPie.data,
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy dữ liệu tổng quan dashboard thành công',
      data,
    });
  }
}
