import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createServiceContractDto: CreateServiceContractDto): Promise<ServiceContract> {
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
    return createdServiceContract.save();
  }

  async findAll(): Promise<ServiceContract[]> {
    return this.serviceContractModel.find()
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
  }

  async findOne(id: string): Promise<ServiceContract> {
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
    return serviceContract;
  }

  async update(id: string, updateServiceContractDto: UpdateServiceContractDto): Promise<ServiceContract> {
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
    
    return updatedServiceContract;
  }

  async remove(id: string): Promise<ServiceContract> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    const deletedServiceContract = await this.serviceContractModel.findByIdAndDelete(id).exec();
    
    if (!deletedServiceContract) {
      throw new NotFoundException('Hợp đồng dịch vụ không tồn tại');
    }
    
    return deletedServiceContract;
  }

  async findByHome(homeId: string): Promise<ServiceContract[]> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return this.serviceContractModel.find({ homeId })
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
  }

  async findByGuest(guestId: string): Promise<ServiceContract[]> {
    const isValidId = Types.ObjectId.isValid(guestId);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return this.serviceContractModel.find({ guestId })
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
  }

  async findByHomeContract(homeContractId: string): Promise<ServiceContract[]> {
    const isValidId = Types.ObjectId.isValid(homeContractId);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    return this.serviceContractModel.find({ homeContractStk: homeContractId })
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
  }

  async findByService(serviceId: string): Promise<ServiceContract[]> {
    const isValidId = Types.ObjectId.isValid(serviceId);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    return this.serviceContractModel.find({ serviceId })
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
  }
} 