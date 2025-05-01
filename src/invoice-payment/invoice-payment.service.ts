import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InvoicePayment, InvoicePaymentDocument } from './schema/invoice-payment.schema';
import { CreateInvoicePaymentDto } from './dto/create-invoice-payment.dto';
import { UpdateInvoicePaymentDto } from './dto/update-invoice-payment.dto';
import { HomeContractService } from '../home-contract/home-contract.service';
import { HomeService } from '../home/home.service';
import { ServiceContractService } from '../service-contract/service-contract.service';
import { ReceiverService } from '../receiver/receiver.service';

@Injectable()
export class InvoicePaymentService {
  constructor(
    @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePaymentDocument>,
    private homeContractService: HomeContractService,
    private homeService: HomeService,
    private serviceContractService: ServiceContractService,
    private receiverService: ReceiverService,
  ) {}

  async create(createInvoicePaymentDto: CreateInvoicePaymentDto): Promise<InvoicePayment> {
    await this.homeService.findOne(createInvoicePaymentDto.homeId.toString());
    
    if (createInvoicePaymentDto.homeContractId) {
      await this.homeContractService.findOne(createInvoicePaymentDto.homeContractId.toString());
    }
    
    if (createInvoicePaymentDto.serviceContractId) {
      await this.serviceContractService.findOne(createInvoicePaymentDto.serviceContractId.toString());
    }
    
    if (createInvoicePaymentDto.receiverId) {
      await this.receiverService.findOne(createInvoicePaymentDto.receiverId.toString());
    }
    
    const createdInvoicePayment = new this.invoicePaymentModel(createInvoicePaymentDto);
    return createdInvoicePayment.save();
  }

  async findAll(): Promise<InvoicePayment[]> {
    return this.invoicePaymentModel.find()
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
  }

  async findOne(id: string): Promise<InvoicePayment> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    const invoicePayment = await this.invoicePaymentModel.findById(id)
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
    return invoicePayment;
  }

  async update(id: string, updateInvoicePaymentDto: UpdateInvoicePaymentDto): Promise<InvoicePayment> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    if (updateInvoicePaymentDto.homeId) {
      await this.homeService.findOne(updateInvoicePaymentDto.homeId.toString());
    }
    
    if (updateInvoicePaymentDto.homeContractId) {
      await this.homeContractService.findOne(updateInvoicePaymentDto.homeContractId.toString());
    }
    
    if (updateInvoicePaymentDto.serviceContractId) {
      await this.serviceContractService.findOne(updateInvoicePaymentDto.serviceContractId.toString());
    }
    
    if (updateInvoicePaymentDto.receiverId) {
      await this.receiverService.findOne(updateInvoicePaymentDto.receiverId.toString());
    }
    
    const updatedInvoicePayment = await this.invoicePaymentModel
      .findByIdAndUpdate(id, updateInvoicePaymentDto, { new: true })
      .exec();
    
    if (!updatedInvoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    return updatedInvoicePayment;
  }

  async remove(id: string): Promise<InvoicePayment> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    const deletedInvoicePayment = await this.invoicePaymentModel.findByIdAndDelete(id).exec();
    
    if (!deletedInvoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    return deletedInvoicePayment;
  }

  async findByHomeContract(homeContractId: string): Promise<InvoicePayment[]> {
    const isValidId = Types.ObjectId.isValid(homeContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    return this.invoicePaymentModel.find({ homeContractId })
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
  }

  async findByServiceContract(serviceContractId: string): Promise<InvoicePayment[]> {
    const isValidId = Types.ObjectId.isValid(serviceContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    return this.invoicePaymentModel.find({ serviceContractId })
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
  }

  async findByHome(homeId: string): Promise<InvoicePayment[]> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return this.invoicePaymentModel.find({ homeId })
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
  }

  async findDuePayments(): Promise<InvoicePayment[]> {
    // Lấy ngày hiện tại
    const now = new Date();
    
    // Lấy ngày 7 ngày tới
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    // Tìm các hóa đơn sắp đến hạn thanh toán và chưa thanh toán
    return this.invoicePaymentModel.find({
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
  }

  async updatePaymentStatus(id: string, statusPaym: number): Promise<InvoicePayment> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    // Nếu đánh dấu là đã thanh toán, cập nhật ngày thanh toán thực tế
    const update: any = { statusPaym };
    if (statusPaym === 2) { // Đã thanh toán
      update.datePaymentReal = new Date();
    }
    
    const updatedInvoicePayment = await this.invoicePaymentModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    
    if (!updatedInvoicePayment) {
      throw new NotFoundException('Hóa đơn thanh toán không tồn tại');
    }
    
    return updatedInvoicePayment;
  }

  // Tạo các đợt thanh toán tự động dựa trên hợp đồng nhà
  async generatePaymentsForHomeContract(homeContractId: string): Promise<InvoicePayment[]> {
    const homeContract = await this.homeContractService.findOne(homeContractId);
    
    // Lấy thông tin căn hộ và người nhận (nếu cần)
    const homeId = homeContract.homeId;
    
    // Tính toán số đợt thanh toán dựa trên thời hạn và chu kỳ thanh toán
    const totalPayments = Math.ceil(homeContract.duration / homeContract.payCycle);
    
    const createdPayments: InvoicePayment[] = [];
    
    for (let i = 0; i < totalPayments; i++) {
      // Tính ngày bắt đầu và kết thúc của mỗi đợt thanh toán
      const startDate = new Date(homeContract.dateStar);
      startDate.setMonth(startDate.getMonth() + (i * homeContract.payCycle));
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + homeContract.payCycle);
      
      // Tính ngày dự kiến thanh toán (trước ngày kết thúc 7 ngày)
      const expectedPaymentDate = new Date(endDate);
      expectedPaymentDate.setDate(expectedPaymentDate.getDate() - 7);
      
      // Tính ngày nhắc thanh toán (trước ngày dự kiến thanh toán 7 ngày)
      const remindDate = new Date(expectedPaymentDate);
      remindDate.setDate(remindDate.getDate() - 7);
      
      const payment = new this.invoicePaymentModel({
        homeContractId,
        homeId,
        type: 1, // Tiền thuê nhà
        dateStar: startDate,
        dateEnd: endDate,
        datePaymentRemind: remindDate,
        datePaymentExpec: expectedPaymentDate,
        statusPaym: 1, // Chưa thanh toán
        totalReceive: homeContract.renta, // Số tiền thuê nhà
      });
      
      await payment.save();
      createdPayments.push(payment);
    }
    
    return createdPayments;
  }

  // Tạo các đợt thanh toán tự động dựa trên hợp đồng dịch vụ
  async generatePaymentsForServiceContract(serviceContractId: string): Promise<InvoicePayment[]> {
    const serviceContract = await this.serviceContractService.findOne(serviceContractId);
    
    // Lấy thông tin căn hộ
    const homeId = serviceContract.homeId;
    
    // Tính toán số đợt thanh toán dựa trên thời hạn và chu kỳ thanh toán
    const totalPayments = Math.ceil(serviceContract.duration / serviceContract.payCycle);
    
    const createdPayments: InvoicePayment[] = [];
    
    for (let i = 0; i < totalPayments; i++) {
      // Tính ngày bắt đầu và kết thúc của mỗi đợt thanh toán
      const startDate = new Date(serviceContract.dateStar);
      startDate.setMonth(startDate.getMonth() + (i * serviceContract.payCycle));
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + serviceContract.payCycle);
      
      // Kiểm tra nếu vượt quá ngày kết thúc của hợp đồng
      if (endDate > new Date(serviceContract.dateEnd)) {
        break;
      }
      
      // Tính ngày dự kiến thanh toán (trước ngày kết thúc 7 ngày)
      const expectedPaymentDate = new Date(endDate);
      expectedPaymentDate.setDate(expectedPaymentDate.getDate() - 7);
      
      // Tính ngày nhắc thanh toán (trước ngày dự kiến thanh toán 7 ngày)
      const remindDate = new Date(expectedPaymentDate);
      remindDate.setDate(remindDate.getDate() - 7);
      
      const payment = new this.invoicePaymentModel({
        serviceContractId,
        homeId,
        type: 2, // Tiền dịch vụ
        dateStar: startDate,
        dateEnd: endDate,
        datePaymentRemind: remindDate,
        datePaymentExpec: expectedPaymentDate,
        statusPaym: 1, // Chưa thanh toán
        totalReceive: serviceContract.unitCost, // Số tiền dịch vụ
      });
      
      await payment.save();
      createdPayments.push(payment);
    }
    
    return createdPayments;
  }
} 