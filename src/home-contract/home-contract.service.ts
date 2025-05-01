import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HomeContract, HomeContractDocument } from './schema/home-contract.schema';
import { CreateHomeContractDto } from './dto/create-home-contract.dto';
import { UpdateHomeContractDto } from './dto/update-home-contract.dto';
import { GuestService } from '../guest/guest.service';
import { HomeService } from '../home/home.service';

@Injectable()
export class HomeContractService {
  constructor(
    @InjectModel(HomeContract.name) private homeContractModel: Model<HomeContractDocument>,
    private guestService: GuestService,
    private homeService: HomeService,
  ) {}

  async create(createHomeContractDto: CreateHomeContractDto): Promise<HomeContract> {
    // Kiểm tra xem khách hàng có tồn tại hay không
    await this.guestService.findOne(createHomeContractDto.guestId.toString());
    
    // Kiểm tra xem căn hộ có tồn tại hay không
    await this.homeService.findOne(createHomeContractDto.homeId.toString());
    
    const createdHomeContract = new this.homeContractModel(createHomeContractDto);
    return createdHomeContract.save();
  }

  async findAll(): Promise<HomeContract[]> {
    return this.homeContractModel.find()
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();
  }

  async findOne(id: string): Promise<HomeContract> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    const homeContract = await this.homeContractModel.findById(id)
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();
    
    if (!homeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    return homeContract;
  }

  async update(id: string, updateHomeContractDto: UpdateHomeContractDto): Promise<HomeContract> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    // Nếu có cập nhật khách hàng, kiểm tra xem khách hàng có tồn tại hay không
    if (updateHomeContractDto.guestId) {
      await this.guestService.findOne(updateHomeContractDto.guestId.toString());
    }
    
    // Nếu có cập nhật căn hộ, kiểm tra xem căn hộ có tồn tại hay không
    if (updateHomeContractDto.homeId) {
      await this.homeService.findOne(updateHomeContractDto.homeId.toString());
    }
    
    const updatedHomeContract = await this.homeContractModel
      .findByIdAndUpdate(id, updateHomeContractDto, { new: true })
      .exec();
    
    if (!updatedHomeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    return updatedHomeContract;
  }

  async remove(id: string): Promise<HomeContract> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    const deletedHomeContract = await this.homeContractModel.findByIdAndDelete(id).exec();
    
    if (!deletedHomeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }
    
    return deletedHomeContract;
  }

  async findByHome(homeId: string): Promise<HomeContract[]> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return this.homeContractModel.find({ homeId })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();
  }

  async findByGuest(guestId: string): Promise<HomeContract[]> {
    const isValidId = Types.ObjectId.isValid(guestId);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }
    
    return this.homeContractModel.find({ guestId })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();
  }

  async search(query: string): Promise<HomeContract[]> {
    // Tìm các contract có khách hàng hoặc căn hộ phù hợp với từ khóa
    const guests = await this.guestService.search(query);
    const homes = await this.homeService.search(query);
    
    const guestIds = guests.map(guest => guest['_id']);
    const homeIds = homes.map(home => home['_id']);
    
    return this.homeContractModel.find({
      $or: [
        { guestId: { $in: guestIds } },
        { homeId: { $in: homeIds } },
      ],
    })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();
  }
} 