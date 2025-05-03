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
    @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
    @InjectModel(HomeContract.name) private homeContractModel: Model<HomeContract>,
    @InjectModel(ServiceContract.name) private serviceContractModel: Model<ServiceContract>,
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(Guest.name) private guestModel: Model<Guest>,
    @InjectModel(HomeOwner.name) private homeOwnerModel: Model<HomeOwner>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  // Thống kê tổng số căn hộ, khách hàng, chủ nhà, dịch vụ
  async getGeneralStatistics(): Promise<ApiResponseType> {
    const [homesCount, guestsCount, homeOwnersCount, servicesCount] = await Promise.all([
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
    const totalHomes = await this.homeModel.countDocuments();
    const rentedHomes = await this.homeModel.countDocuments({ status: 2 }); // Giả sử status 2 là đã thuê
    const availableHomes = await this.homeModel.countDocuments({ status: 1 }); // Giả sử status 1 là đang cho thuê

    const data = {
      totalHomes,
      rentedHomes,
      availableHomes,
      rentedPercentage: (rentedHomes / totalHomes) * 100,
      availablePercentage: (availableHomes / totalHomes) * 100,
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
    
    const activeHomeContracts = await this.homeContractModel.countDocuments({
      dateEnd: { $gte: new Date() },
    });
    
    const activeServiceContracts = await this.serviceContractModel.countDocuments({
      dateEnd: { $gte: new Date() },
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
    const totalPayments = await this.invoicePaymentModel.countDocuments({ statusPaym: 2 }); // Đã thanh toán
    
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
} 