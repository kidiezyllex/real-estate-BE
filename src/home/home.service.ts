import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Home, HomeDocument } from './schema/home.schema';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomeOwnerService } from '../home-owner/home-owner.service';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    private homeOwnerService: HomeOwnerService,
  ) {}

  async create(createHomeDto: CreateHomeDto): Promise<ApiResponseType> {
    // Kiểm tra xem chủ nhà có tồn tại hay không
    await this.homeOwnerService.findOne(createHomeDto.homeOwnerId.toString());
    
    const createdHome = new this.homeModel(createHomeDto);
    const result = await createdHome.save();
    
    return createApiResponse({
      statusCode: 201,
      message: 'Tạo căn hộ thành công',
      data: result,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const homes = await this.homeModel.find().populate('homeOwnerId').exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách căn hộ thành công',
      data: homes,
    });
  }

  async findAvailable(): Promise<ApiResponseType> {
    const homes = await this.homeModel.find({ active: true }).populate('homeOwnerId').exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách căn hộ đang hoạt động thành công',
      data: homes,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    const home = await this.homeModel.findById(id).populate('homeOwnerId').exec();
    if (!home) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin căn hộ thành công',
      data: home,
    });
  }

  async update(id: string, updateHomeDto: UpdateHomeDto): Promise<ApiResponseType> {
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
    
    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật thông tin căn hộ thành công',
      data: updatedHome,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    const deletedHome = await this.homeModel.findByIdAndDelete(id).exec();
    
    if (!deletedHome) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }
    
    return createApiResponse({
      statusCode: 200,
      message: 'Xóa căn hộ thành công',
      data: deletedHome,
    });
  }

  async findByHomeOwner(homeOwnerId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeOwnerId);
    if (!isValidId) {
      throw new NotFoundException('Chủ nhà không tồn tại');
    }
    
    const homes = await this.homeModel.find({ homeOwnerId }).populate('homeOwnerId').exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách căn hộ theo chủ nhà thành công',
      data: homes,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    const homes = await this.homeModel.find({
      $or: [
        { address: { $regex: query, $options: 'i' } },
        { district: { $regex: query, $options: 'i' } },
        { ward: { $regex: query, $options: 'i' } },
        { building: { $regex: query, $options: 'i' } },
      ],
    }).populate('homeOwnerId').exec();
    
    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm căn hộ thành công',
      data: homes,
    });
  }
} 