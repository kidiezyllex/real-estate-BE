import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HomeOwner, HomeOwnerDocument } from './schema/home-owner.schema';
import { CreateHomeOwnerDto } from './dto/create-home-owner.dto';
import { UpdateHomeOwnerDto } from './dto/update-home-owner.dto';

@Injectable()
export class HomeOwnerService {
  constructor(
    @InjectModel(HomeOwner.name) private homeOwnerModel: Model<HomeOwnerDocument>,
  ) {}

  async create(createHomeOwnerDto: CreateHomeOwnerDto): Promise<HomeOwner> {
    const createdHomeOwner = new this.homeOwnerModel(createHomeOwnerDto);
    return createdHomeOwner.save();
  }

  async findAll(): Promise<HomeOwner[]> {
    return this.homeOwnerModel.find().exec();
  }

  async findOne(id: string): Promise<HomeOwner> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    
    const homeOwner = await this.homeOwnerModel.findById(id).exec();
    if (!homeOwner) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    return homeOwner;
  }

  async update(id: string, updateHomeOwnerDto: UpdateHomeOwnerDto): Promise<HomeOwner> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    
    const updatedHomeOwner = await this.homeOwnerModel
      .findByIdAndUpdate(id, updateHomeOwnerDto, { new: true })
      .exec();
    
    if (!updatedHomeOwner) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    
    return updatedHomeOwner;
  }

  async remove(id: string): Promise<HomeOwner> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    
    const deletedHomeOwner = await this.homeOwnerModel.findByIdAndDelete(id).exec();
    
    if (!deletedHomeOwner) {
      throw new NotFoundException('HomeOwner không tồn tại');
    }
    
    return deletedHomeOwner;
  }

  async search(query: string): Promise<HomeOwner[]> {
    return this.homeOwnerModel.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }
} 