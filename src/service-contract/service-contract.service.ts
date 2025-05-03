import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ServiceContract, ServiceContractDocument } from './schema/service-contract.schema';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { UpdateServiceContractDto } from './dto/update-service-contract.dto';
import { GuestService } from '../guest/guest.service';
import { HomeService } from '../home/home.service';
import { ServiceService } from '../service/service.service';
import { HomeContractService } from '../home-contract/home-contract.service';

@Injectable()
export class ServiceContractService {
  constructor(
    @InjectModel(ServiceContract.name) private serviceContractModel: Model<ServiceContractDocument>,
    private guestService: GuestService,
    private homeService: HomeService,
    private serviceService: ServiceService,
    private homeContractService: HomeContractService,
  ) {}

  async create(createServiceContractDto: CreateServiceContractDto): Promise<ApiResponseType> {
    // Kiểm tra xem dịch vụ có tồn tại hay không
    await this.serviceService.findOne(createServiceContractDto.serviceId.toString());
    
    // Kiểm tra xem căn hộ có tồn tại hay không
    await this.homeService.findOne(createServiceContractDto.homeId.toString());
    
    // Kiểm tra xem khách hàng có tồn tại hay không
    await this.guestService.findOne(createServiceContractDto.guestId.toString());
    
    // Nếu có liên kết với hợp đồng nhà, kiểm tra xem hợp đồng nhà có tồn tại không
    if (createServiceContractDto.homeContractStk) {
      await this.homeContractService.findOne(createServiceContractDto.homeContractStk.toString());
    }
    
    const createdServiceContract = new this.serviceContractModel(createServiceContractDto);
    const createResult = await createdServiceContract.save();
    
    return createApiResponse({
      statusCode: 201,
      message: 'Tạo hợp đồng dịch vụ thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const contracts = await this.serviceContractModel.find()
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng dịch vụ thành công',
      data: contracts,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    const serviceContract = await this.serviceContractModel.findById(id)
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    if (!serviceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin hợp đồng dịch vụ thành công',
      data: serviceContract,
    });
  }

  async update(id: string, updateServiceContractDto: UpdateServiceContractDto): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    // Thực hiện các kiểm tra nếu có cập nhật các trường tham chiếu
    if (updateServiceContractDto.serviceId) {
      await this.serviceService.findOne(updateServiceContractDto.serviceId.toString());
    }
    
    if (updateServiceContractDto.homeId) {
      await this.homeService.findOne(updateServiceContractDto.homeId.toString());
    }
    
    if (updateServiceContractDto.guestId) {
      await this.guestService.findOne(updateServiceContractDto.guestId.toString());
    }
    
    if (updateServiceContractDto.homeContractStk) {
      await this.homeContractService.findOne(updateServiceContractDto.homeContractStk.toString());
    }
    
    const updatedServiceContract = await this.serviceContractModel
      .findByIdAndUpdate(id, updateServiceContractDto, { new: true })
      .exec();
    
    if (!updatedServiceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật hợp đồng dịch vụ thành công',
      data: updatedServiceContract,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    const deletedServiceContract = await this.serviceContractModel.findByIdAndDelete(id).exec();
    
    if (!deletedServiceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Xóa hợp đồng dịch vụ thành công',
      data: deletedServiceContract,
    });
  }

  async findByHome(homeId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    const contracts = await this.serviceContractModel.find({ homeId })
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng dịch vụ theo căn hộ thành công',
      data: contracts,
    });
  }

  async findByGuest(guestId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(guestId);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const contracts = await this.serviceContractModel.find({ guestId })
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng dịch vụ theo khách hàng thành công',
      data: contracts,
    });
  }

  async findByHomeContract(homeContractId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    const contracts = await this.serviceContractModel.find({ homeContractStk: homeContractId })
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng dịch vụ theo hợp đồng nhà thành công',
      data: contracts,
    });
  }

  async findByService(serviceId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(serviceId);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    const contracts = await this.serviceContractModel.find({ serviceId })
      .populate('serviceId')
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .populate('homeContractStk')
      .exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng dịch vụ theo dịch vụ thành công',
      data: contracts,
    });
  }
} 