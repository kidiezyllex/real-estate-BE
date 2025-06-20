import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  HomeContract,
  HomeContractDocument,
} from './schema/home-contract.schema';
import { CreateHomeContractDto } from './dto/create-home-contract.dto';
import { UpdateHomeContractDto } from './dto/update-home-contract.dto';
import { GuestService } from '../guest/guest.service';
import { HomeService } from '../home/home.service';

@Injectable()
export class HomeContractService {
  constructor(
    @InjectModel(HomeContract.name)
    private homeContractModel: Model<HomeContractDocument>,
    private guestService: GuestService,
    private homeService: HomeService,
  ) {}

  async create(
    createHomeContractDto: CreateHomeContractDto,
  ): Promise<ApiResponseType> {
    // Kiểm tra xem khách hàng có tồn tại hay không
    await this.guestService.findOne(createHomeContractDto.guestId.toString());

    // Kiểm tra xem căn hộ có tồn tại hay không
    await this.homeService.findOne(createHomeContractDto.homeId.toString());

    // Kiểm tra xem căn hộ đã được cho thuê hay chưa
    const existingActiveContract = await this.homeContractModel
      .findOne({
        homeId: createHomeContractDto.homeId,
        status: 1, // Status 1 = Đang hiệu lực
      })
      .exec();

    if (existingActiveContract) {
      throw new BadRequestException(
        'Căn hộ này đã được cho thuê và đang có hợp đồng hiệu lực',
      );
    }

    // Map price từ DTO thành renta cho schema
    const contractData = {
      ...createHomeContractDto,
      renta: createHomeContractDto.price,
    } as any;
    delete contractData.price;

    const createdHomeContract = new this.homeContractModel(contractData);
    const createResult = await createdHomeContract.save();

    // Cập nhật homeContract trong Home model
    await this.homeService.updateHomeContract(
      createHomeContractDto.homeId.toString(),
      createResult._id.toString(),
    );

    return createApiResponse({
      statusCode: 201,
      message: 'Tạo hợp đồng nhà thành công',
      data: createResult,
    });
  }

  async findAll(): Promise<ApiResponseType> {
    const contracts = await this.homeContractModel
      .find()
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng nhà thành công',
      data: contracts,
    });
  }

  async findOne(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    const homeContract = await this.homeContractModel
      .findById(id)
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
    return createApiResponse({
      statusCode: 200,
      message: 'Lấy thông tin hợp đồng nhà thành công',
      data: homeContract,
    });
  }

  async update(
    id: string,
    updateHomeContractDto: UpdateHomeContractDto,
  ): Promise<ApiResponseType> {
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

    // Map price từ DTO thành renta cho schema nếu có
    const updateData = { ...updateHomeContractDto } as any;
    if (updateData.price !== undefined) {
      updateData.renta = updateData.price;
      delete updateData.price;
    }

    const updatedHomeContract = await this.homeContractModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedHomeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    // Nếu trạng thái hợp đồng được cập nhật thành hết hạn (2) hoặc đã hủy (3),
    // cập nhật homeContract trong Home model về null
    if (
      updateData.status &&
      (updateData.status === 2 || updateData.status === 3)
    ) {
      await this.homeService.updateHomeContract(
        updatedHomeContract.homeId.toString(),
        null,
      );
    }

    return createApiResponse({
      statusCode: 200,
      message: 'Cập nhật hợp đồng nhà thành công',
      data: updatedHomeContract,
    });
  }

  async remove(id: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    const deletedHomeContract = await this.homeContractModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedHomeContract) {
      throw new NotFoundException('Hợp đồng nhà không tồn tại');
    }

    // Cập nhật homeContract trong Home model về null khi xóa hợp đồng
    await this.homeService.updateHomeContract(
      deletedHomeContract.homeId.toString(),
      null,
    );

    return createApiResponse({
      statusCode: 200,
      message: 'Xóa hợp đồng nhà thành công',
      data: deletedHomeContract,
    });
  }

  async findByHome(homeId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(homeId);
    if (!isValidId) {
      throw new NotFoundException('Căn hộ không tồn tại');
    }

    const objectId = new Types.ObjectId(homeId);

    const contracts = await this.homeContractModel
      .find({ homeId: objectId })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng theo căn hộ thành công',
      data: contracts,
    });
  }

  async findByGuest(guestId: string): Promise<ApiResponseType> {
    const isValidId = Types.ObjectId.isValid(guestId);
    if (!isValidId) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }

    // Convert string to ObjectId for proper querying
    const objectId = new Types.ObjectId(guestId);

    const contracts = await this.homeContractModel
      .find({ guestId: objectId })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy danh sách hợp đồng theo khách hàng thành công',
      data: contracts,
    });
  }

  async search(query: string): Promise<ApiResponseType> {
    // Tìm các contract có khách hàng hoặc căn hộ phù hợp với từ khóa
    const guestsResponse = await this.guestService.search(query);
    const homesResponse = await this.homeService.search(query);

    const guests = guestsResponse.data || [];
    const homes = homesResponse.data || [];

    const guestIds = guests.map((guest) => guest._id);
    const homeIds = homes.map((home) => home._id);

    const contracts = await this.homeContractModel
      .find({
        $or: [{ guestId: { $in: guestIds } }, { homeId: { $in: homeIds } }],
      })
      .populate('guestId')
      .populate({
        path: 'homeId',
        populate: {
          path: 'homeOwnerId',
        },
      })
      .exec();

    return createApiResponse({
      statusCode: 200,
      message: 'Tìm kiếm hợp đồng nhà thành công',
      data: contracts,
    });
  }
}
