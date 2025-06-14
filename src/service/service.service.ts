import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
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

  async create(createServiceDto: CreateServiceDto): Promise<ApiResponseType> {
    const createdService = new this.serviceModel(createServiceDto);
    const createResult = await createdService.save();

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo dịch vụ thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const findAllResult = await this.serviceModel.find().exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách dịch vụ thành công',
      data: findAllResult,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }

    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin dịch vụ thành công',
      data: service,
    });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ApiResponseType> {
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

    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật dịch vụ thành công',
      data: updatedService,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }

    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();

    if (!deletedService) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Xóa dịch vụ thành công',
      data: deletedService,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    const results = await this.serviceModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm dịch vụ thành công',
      data: results,
    });
  }
}
