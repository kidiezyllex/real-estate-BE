import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Receiver, ReceiverDocument } from './schema/receiver.schema';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Injectable()
export class ReceiverService {
  constructor(
    @InjectModel(Receiver.name) private receiverModel: Model<ReceiverDocument>,
  ) {}

  async create(createReceiverDto: CreateReceiverDto): Promise<ApiResponseType> {
    const createdReceiver = new this.receiverModel(createReceiverDto);
    const createResult = await createdReceiver.save();
    
    return createApiResponse({
      statusCode: 201,
      message: 'Tạo người nhận thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const findAllResult = await this.receiverModel.find().exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách người nhận thành công',
      data: findAllResult,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    const receiver = await this.receiverModel.findById(id).exec();
    if (!receiver) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin người nhận thành công',
      data: receiver,
    });
  }

  async update(id: string, updateReceiverDto: UpdateReceiverDto): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    const updatedReceiver = await this.receiverModel
      .findByIdAndUpdate(id, updateReceiverDto, { new: true })
      .exec();
    
    if (!updatedReceiver) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật thông tin người nhận thành công',
      data: updatedReceiver,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    const deletedReceiver = await this.receiverModel.findByIdAndDelete(id).exec();
    
    if (!deletedReceiver) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Xóa người nhận thành công',
      data: deletedReceiver,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    const results = await this.receiverModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { bankAccount: { $regex: query, $options: 'i' } },
      ],
    }).exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm người nhận thành công',
      data: results,
    });
  }
} 