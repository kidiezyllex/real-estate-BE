import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createReceiverDto: CreateReceiverDto): Promise<Receiver> {
    const createdReceiver = new this.receiverModel(createReceiverDto);
    return createdReceiver.save();
  }

  async findAll(): Promise<Receiver[]> {
    return this.receiverModel.find().exec();
  }

  async findOne(id: string): Promise<Receiver> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    const receiver = await this.receiverModel.findById(id).exec();
    if (!receiver) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    return receiver;
  }

  async update(id: string, updateReceiverDto: UpdateReceiverDto): Promise<Receiver> {
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
    
    return updatedReceiver;
  }

  async remove(id: string): Promise<Receiver> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    const deletedReceiver = await this.receiverModel.findByIdAndDelete(id).exec();
    
    if (!deletedReceiver) {
      throw new NotFoundException('Người nhận không tồn tại');
    }
    
    return deletedReceiver;
  }

  async search(query: string): Promise<Receiver[]> {
    return this.receiverModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { bankAccount: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }
} 