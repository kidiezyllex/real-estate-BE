import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HomeOwner, HomeOwnerDocument } from './schema/home-owner.schema';
import { CreateHomeOwnerDto } from './dto/create-home-owner.dto';
import { UpdateHomeOwnerDto } from './dto/update-home-owner.dto';

@Injectable()
export class HomeOwnerService {
  constructor(
    @InjectModel(HomeOwner.name)
    private homeOwnerModel: Model<HomeOwnerDocument>,
  ) {}

  async create(
    createHomeOwnerDto: CreateHomeOwnerDto,
  ): Promise<ApiResponseType> {
    const createdHomeOwner = new this.homeOwnerModel(createHomeOwnerDto);
    const createResult = await createdHomeOwner.save();

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo chủ nhà thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const findAllResult = await this.homeOwnerModel.find().exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách chủ nhà thành công',
      data: findAllResult,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }

    const homeOwner = await this.homeOwnerModel.findById(id).exec();
    if (!homeOwner) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin chủ nhà thành công',
      data: homeOwner,
    });
  }

  async update(
    id: string,
    updateHomeOwnerDto: UpdateHomeOwnerDto,
  ): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }

    const updatedHomeOwner = await this.homeOwnerModel
      .findByIdAndUpdate(id, updateHomeOwnerDto, { new: true })
      .exec();

    if (!updatedHomeOwner) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật thông tin chủ nhà thành công',
      data: updatedHomeOwner,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }

    const deletedHomeOwner = await this.homeOwnerModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedHomeOwner) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Xóa chủ nhà thành công',
      data: deletedHomeOwner,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    const results = await this.homeOwnerModel
      .find({
        $or: [
          { fullname: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm chủ nhà thành công',
      data: results,
    });
  }
}
