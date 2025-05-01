import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Home, HomeDocument } from './schema/home.schema';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomeOwnerService } from '../home-owner/home-owner.service';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    private homeOwnerService: HomeOwnerService,
  ) {}

  async create(createHomeDto: CreateHomeDto): Promise<Home> {
    // Kiểm tra xem chủ nhà có tồn tại hay không
    await this.homeOwnerService.findOne(createHomeDto.homeOwnerId.toString());
    
    const createdHome = new this.homeModel(createHomeDto);
    return createdHome.save();
  }

  async findAll(): Promise<Home[]> {
    return this.homeModel.find().populate('homeOwnerId').exec();
  }

  async findAvailable(): Promise<Home[]> {
    return this.homeModel.find({ active: true }).populate('homeOwnerId').exec();
  }

  async findOne(id: string): Promise<Home> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    const home = await this.homeModel.findById(id).populate('homeOwnerId').exec();
    if (!home) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    return home;
  }

  async update(id: string, updateHomeDto: UpdateHomeDto): Promise<Home> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    // Nếu có cập nhật chủ nhà, kiểm tra xem chủ nhà có tồn tại hay không
    if (updateHomeDto.homeOwnerId) {
      await this.homeOwnerService.findOne(updateHomeDto.homeOwnerId.toString());
    }
    
    const updatedHome = await this.homeModel
      .findByIdAndUpdate(id, updateHomeDto, { new: true })
      .exec();
    
    if (!updatedHome) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return updatedHome;
  }

  async remove(id: string): Promise<Home> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    const deletedHome = await this.homeModel.findByIdAndDelete(id).exec();
    
    if (!deletedHome) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return deletedHome;
  }

  async findByHomeOwner(homeOwnerId: string): Promise<Home[]> {
    const isValidId = Types.ObjectId.isValid(homeOwnerId);
    if (!isValidId) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }
    
    return this.homeModel.find({ homeOwnerId }).populate('homeOwnerId').exec();
  }

  async search(query: string): Promise<Home[]> {
    return this.homeModel.find({
      $or: [
        { address: { $regex: query, $options: 'i' } },
        { district: { $regex: query, $options: 'i' } },
        { ward: { $regex: query, $options: 'i' } },
        { building: { $regex: query, $options: 'i' } },
      ],
    }).populate('homeOwnerId').exec();
  }
} 