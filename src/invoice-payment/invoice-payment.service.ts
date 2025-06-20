import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  InvoicePayment,
  InvoicePaymentDocument,
} from './schema/invoice-payment.schema';
import { CreateInvoicePaymentDto } from './dto/create-invoice-payment.dto';
import { UpdateInvoicePaymentDto } from './dto/update-invoice-payment.dto';
import { HomeContractService } from '../home-contract/home-contract.service';
import { HomeService } from '../home/home.service';
import { ServiceContractService } from '../service-contract/service-contract.service';
import { ReceiverService } from '../receiver/receiver.service';

@Injectable()
export class InvoicePaymentService {
  constructor(
    @InjectModel(InvoicePayment.name)
    private invoicePaymentModel: Model<InvoicePaymentDocument>,
    private homeContractService: HomeContractService,
    private homeService: HomeService,
    private serviceContractService: ServiceContractService,
    private receiverService: ReceiverService,
  ) {}

  async create(
    createInvoicePaymentDto: CreateInvoicePaymentDto,
  ): Promise<ApiResponseType> {
    let homeId = createInvoicePaymentDto.homeId;

    if (!homeId && createInvoicePaymentDto.homeContractId) {
      const homeContractResponse = await this.homeContractService.findOne(
        createInvoicePaymentDto.homeContractId.toString(),
      );
      // homeId is populated, so we need to get the _id from the populated object
      homeId = homeContractResponse.data.homeId._id || homeContractResponse.data.homeId;
    }

    if (!homeId && createInvoicePaymentDto.serviceContractId) {
      const serviceContractResponse = await this.serviceContractService.findOne(
        createInvoicePaymentDto.serviceContractId.toString(),
      );
      // homeId is populated, so we need to get the _id from the populated object
      homeId = serviceContractResponse.data.homeId._id || serviceContractResponse.data.homeId;
    }

    if (!homeId) {
      throw new BadRequestException('homeId, homeContractId hoặc serviceContractId là bắt buộc');
    }

    // Validate homeId exists
    await this.homeService.findOne(homeId.toString());

    // Validate other references if provided
    if (createInvoicePaymentDto.homeContractId) {
      await this.homeContractService.findOne(
        createInvoicePaymentDto.homeContractId.toString(),
      );
    }

    if (createInvoicePaymentDto.serviceContractId) {
      await this.serviceContractService.findOne(
        createInvoicePaymentDto.serviceContractId.toString(),
      );
    }

    if (createInvoicePaymentDto.receiverId) {
      await this.receiverService.findOne(
        createInvoicePaymentDto.receiverId.toString(),
      );
    }

    // Set default dates if not provided
    const now = new Date();
    const invoiceData = {
      ...createInvoicePaymentDto,
      homeId,
      dateStar: createInvoicePaymentDto.dateStar || now.toISOString().split('T')[0],
      dateEnd: createInvoicePaymentDto.dateEnd || new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0],
    };

    const createdInvoicePayment = new this.invoicePaymentModel(invoiceData);
    const createResult = await createdInvoicePayment.save();

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo hóa đơn thanh toán thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const payments = await this.invoicePaymentModel
      .find()
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hóa đơn thanh toán thành công',
      data: payments,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    const invoicePayment = await this.invoicePaymentModel
      .findById(id)
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    if (!invoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin hóa đơn thanh toán thành công',
      data: invoicePayment,
    });
  }

  async update(
    id: string,
    updateInvoicePaymentDto: UpdateInvoicePaymentDto,
  ): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    if (updateInvoicePaymentDto.homeId) {
      await this.homeService.findOne(updateInvoicePaymentDto.homeId.toString());
    }

    if (updateInvoicePaymentDto.homeContractId) {
      await this.homeContractService.findOne(
        updateInvoicePaymentDto.homeContractId.toString(),
      );
    }

    if (updateInvoicePaymentDto.serviceContractId) {
      await this.serviceContractService.findOne(
        updateInvoicePaymentDto.serviceContractId.toString(),
      );
    }

    if (updateInvoicePaymentDto.receiverId) {
      await this.receiverService.findOne(
        updateInvoicePaymentDto.receiverId.toString(),
      );
    }

    const updatedInvoicePayment = await this.invoicePaymentModel
      .findByIdAndUpdate(id, updateInvoicePaymentDto, { new: true })
      .exec();

    if (!updatedInvoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật hóa đơn thanh toán thành công',
      data: updatedInvoicePayment,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    const deletedInvoicePayment = await this.invoicePaymentModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedInvoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Xóa hóa đơn thanh toán thành công',
      data: deletedInvoicePayment,
    });
  }

  async findByHomeContract(homeContractId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    // Convert string to ObjectId for proper querying
    const objectId = new Types.ObjectId(homeContractId);

    const payments = await this.invoicePaymentModel
      .find({ homeContractId: objectId })
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hóa đơn theo hợp đồng nhà thành công',
      data: payments,
    });
  }

  async findByServiceContract(
    serviceContractId: string,
  ): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(serviceContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }

    // Convert string to ObjectId for proper querying
    const objectId = new Types.ObjectId(serviceContractId);

    const payments = await this.invoicePaymentModel
      .find({ serviceContractId: objectId })
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hóa đơn theo hợp đồng dịch vụ thành công',
      data: payments,
    });
  }

  async findByHome(homeId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }

    // Convert string to ObjectId for proper querying
    const objectId = new Types.ObjectId(homeId);

    const payments = await this.invoicePaymentModel
      .find({ homeId: objectId })
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hóa đơn theo căn hộ thành công',
      data: payments,
    });
  }

  async findDuePayments(): Promise<ApiResponseType> {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const payments = await this.invoicePaymentModel
      .find({
        datePaymentExpec: { $gte: now, $lte: sevenDaysLater },
        statusPaym: 1, // Chưa thanh toán
      })
      .populate('homeContractId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate('receiverId')
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hóa đơn sắp đến hạn thành công',
      data: payments,
    });
  }

  async updatePaymentStatus(
    id: string,
    statusId: number,
  ): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    const invoicePayment = await this.invoicePaymentModel.findById(id).exec();

    if (!invoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }

    // Cập nhật trạng thái thanh toán
    invoicePayment.statusPaym = statusId;

    // Nếu thanh toán thành công, cập nhật ngày thanh toán thực tế
    if (statusId === 2) {
      // Giả sử 2 là trạng thái đã thanh toán
      invoicePayment.datePaymentReal = new Date();
    }

    await invoicePayment.save();

    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật trạng thái thanh toán thành công',
      data: invoicePayment,
    });
  }

  async generatePaymentsForHomeContract(
    homeContractId: string,
  ): Promise<ApiResponseType> {
    const homeContractResponse =
      await this.homeContractService.findOne(homeContractId);
    const homeContract = homeContractResponse.data;

    if (!homeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    // Tạo các khoản thanh toán dựa trên thông tin hợp đồng
    const startDate = new Date(homeContract.dateStart);
    const endDate = new Date(homeContract.dateEnd);

    // Tính số tháng giữa ngày bắt đầu và kết thúc
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const paymentPromises = [];

    for (let i = 0; i <= months; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      // Tạo thông tin hóa đơn
      const payment = new this.invoicePaymentModel({
        homeContractId: homeContract._id,
        homeId: homeContract.homeId,
        dateCreate: new Date(),
        datePaymentExpec: paymentDate,
        datePaymentRemind: new Date(
          paymentDate.getTime() - 7 * 24 * 60 * 60 * 1000,
        ), // 7 ngày trước hạn
        statusPaym: 1, // Chưa thanh toán
        totalReceive: homeContract.price,
        note: `Hóa đơn thuê nhà tháng ${paymentDate.getMonth() + 1}/${paymentDate.getFullYear()}`,
      });

      paymentPromises.push(payment.save());
    }

    const createdPayments = await Promise.all(paymentPromises);

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo các hóa đơn từ hợp đồng nhà thành công',
      data: createdPayments,
    });
  }

  async generatePaymentsForServiceContract(
    serviceContractId: string,
    generatePaymentDto?: {
      startDate: string;
      endDate: string;
      paymentCycle: number;
      amount: number;
    },
  ): Promise<ApiResponseType> {
    const serviceContractResponse =
      await this.serviceContractService.findOne(serviceContractId);
    const serviceContract = serviceContractResponse.data;

    if (!serviceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }

    // Validate required fields
    if (!serviceContract.homeId) {
      throw new BadRequestException('Hợp đồng dịch vụ thiếu thông tin căn hộ');
    }

    // Use parameters from request body if provided, otherwise use service contract data
    const startDate = generatePaymentDto?.startDate 
      ? new Date(generatePaymentDto.startDate)
      : new Date(serviceContract.dateStar);
    const endDate = generatePaymentDto?.endDate
      ? new Date(generatePaymentDto.endDate)
      : new Date(serviceContract.dateEnd);
    const paymentAmount = generatePaymentDto?.amount || serviceContract.unitCost;
    const paymentCycle = generatePaymentDto?.paymentCycle || serviceContract.payCycle;

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    // For the provided date range, create a single payment
    const paymentPromises = [];

    // Create a single invoice payment for the specified period
    const payment = new this.invoicePaymentModel({
      type: 2, // Service payment type
      serviceContractId: serviceContract._id,
      homeId: serviceContract.homeId,
      dateStar: startDate.toISOString().split('T')[0],
      dateEnd: endDate.toISOString().split('T')[0],
      datePaymentExpec: endDate, // Payment expected on end date
      datePaymentRemind: new Date(
        endDate.getTime() - 7 * 24 * 60 * 60 * 1000,
      ), // 7 days before due date
      statusPaym: 0, // Unpaid
      totalReceive: paymentAmount,
      note: `Hóa đơn dịch vụ ${serviceContract.serviceId?.name || 'N/A'} từ ${startDate.toLocaleDateString('vi-VN')} đến ${endDate.toLocaleDateString('vi-VN')}`,
    });

    paymentPromises.push(payment.save());

    const createdPayments = await Promise.all(paymentPromises);

    // Populate the created payments with related data
    const populatedPayments = await this.invoicePaymentModel
      .find({ _id: { $in: createdPayments.map(p => p._id) } })
      .populate({
        path: 'serviceContractId',
        populate: {
          path: 'serviceId',
        },
      })
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo các hóa đơn từ hợp đồng dịch vụ thành công',
      data: populatedPayments,
    });
  }
}
