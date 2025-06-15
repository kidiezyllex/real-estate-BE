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
      console.log('Derived homeId from contract:', homeId);
    }

    if (!homeId) {
      throw new BadRequestException('homeId hoặc homeContractId là bắt buộc');
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

    const payments = await this.invoicePaymentModel
      .find({ homeContractId })
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

    const payments = await this.invoicePaymentModel
      .find({ serviceContractId })
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

    const payments = await this.invoicePaymentModel
      .find({ homeId })
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
  ): Promise<ApiResponseType> {
    const serviceContractResponse =
      await this.serviceContractService.findOne(serviceContractId);
    const serviceContract = serviceContractResponse.data;

    if (!serviceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }

    // Tạo các khoản thanh toán dựa trên thông tin hợp đồng dịch vụ
    const startDate = new Date(serviceContract.dateStart);
    const endDate = new Date(serviceContract.dateEnd);

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
        serviceContractId: serviceContract._id,
        homeId: serviceContract.homeId,
        dateCreate: new Date(),
        datePaymentExpec: paymentDate,
        datePaymentRemind: new Date(
          paymentDate.getTime() - 7 * 24 * 60 * 60 * 1000,
        ), // 7 ngày trước hạn
        statusPaym: 1, // Chưa thanh toán
        totalReceive: serviceContract.price,
        note: `Hóa đơn dịch vụ ${serviceContract.serviceId.name} tháng ${paymentDate.getMonth() + 1}/${paymentDate.getFullYear()}`,
      });

      paymentPromises.push(payment.save());
    }

    const createdPayments = await Promise.all(paymentPromises);

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo các hóa đơn từ hợp đồng dịch vụ thành công',
      data: createdPayments,
    });
  }
}
