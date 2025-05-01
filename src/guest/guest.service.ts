import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Guest, GuestDocument } from './schema/guest.schema';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const createdGuest = new this.guestModel(createGuestDto);
    return createdGuest.save();
  }

  async findAll(): Promise<Guest[]> {
    return this.guestModel.find().exec();
  }

  async findOne(id: string): Promise<Guest> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const guest = await this.guestModel.findById(id).exec();
    if (!guest) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
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
    
    return updatedGuest;
  }

  async remove(id: string): Promise<Guest> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    const deletedGuest = await this.guestModel.findByIdAndDelete(id).exec();
    
    if (!deletedGuest) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return deletedGuest;
  }

  async search(query: string): Promise<Guest[]> {
    return this.guestModel.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }
} 