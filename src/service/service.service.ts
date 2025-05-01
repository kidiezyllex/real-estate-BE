import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from './schema/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const createdService = new this.serviceModel(createServiceDto);
    return createdService.save();
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }

  async findOne(id: string): Promise<Service> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
    
    if (!updatedService) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    return updatedService;
  }

  async remove(id: string): Promise<Service> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    
    if (!deletedService) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    
    return deletedService;
  }

  async search(query: string): Promise<Service[]> {
    return this.serviceModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }
} 