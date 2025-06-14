import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HomeContractService } from './home-contract.service';
import { CreateHomeContractDto } from './dto/create-home-contract.dto';
import { UpdateHomeContractDto } from './dto/update-home-contract.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hợp đồng nhà')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('home-contracts')
export class HomeContractController {
  constructor(private readonly homeContractService: HomeContractService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hợp đồng nhà mới' })
  create(@Body() createHomeContractDto: CreateHomeContractDto) {
    return this.homeContractService.create(createHomeContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả hợp đồng nhà' })
  findAll() {
    return this.homeContractService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm hợp đồng nhà' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.homeContractService.search(query);
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng nhà theo căn hộ' })
  @ApiParam({ name: 'homeId', description: 'ID của căn hộ' })
  findByHome(@Param('homeId') homeId: string) {
    return this.homeContractService.findByHome(homeId);
  }

  @Get('guest/:guestId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng nhà theo khách hàng' })
  @ApiParam({ name: 'guestId', description: 'ID của khách hàng' })
  findByGuest(@Param('guestId') guestId: string) {
    return this.homeContractService.findByGuest(guestId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin hợp đồng nhà theo ID' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng nhà' })
  findOne(@Param('id') id: string) {
    return this.homeContractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin hợp đồng nhà' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng nhà' })
  update(
    @Param('id') id: string,
    @Body() updateHomeContractDto: UpdateHomeContractDto,
  ) {
    return this.homeContractService.update(id, updateHomeContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hợp đồng nhà' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng nhà' })
  remove(@Param('id') id: string) {
    return this.homeContractService.remove(id);
  }
}
