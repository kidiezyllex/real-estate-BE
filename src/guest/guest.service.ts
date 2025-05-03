import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Guest, GuestDocument } from './schema/guest.schema';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<ApiResponseType> {
    const createdGuest = new this.guestModel(createGuestDto);
    const result = await createdGuest.save();
    return createApiResponse({
      statusCode: 201,
      message: 'Tạo khách hàng thành công',
      data: result,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const guests = await this.guestModel.find().exec();
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách khách hàng thành công',
      data: guests,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const guest = await this.guestModel.findById(id).exec();
    if (!guest) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin khách hàng thành công',
      data: guest,
    });
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const updatedGuest = await this.guestModel
      .findByIdAndUpdate(id, updateGuestDto, { new: true })
      .exec();
    
    if (!updatedGuest) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: updatedGuest,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const deletedGuest = await this.guestModel.findByIdAndDelete(id).exec();
    
    if (!deletedGuest) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Xóa khách hàng thành công',
      data: deletedGuest,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    const guests = await this.guestModel.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm khách hàng thành công',
      data: guests,
    });
  }
} 