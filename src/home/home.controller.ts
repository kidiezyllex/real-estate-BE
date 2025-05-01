import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Căn hộ')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo căn hộ mới' })
  create(@Body() createHomeDto: CreateHomeDto) {
    return this.homeService.create(createHomeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả căn hộ' })
  findAll() {
    return this.homeService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Lấy danh sách căn hộ đang cho thuê' })
  findAvailable() {
    return this.homeService.findAvailable();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm căn hộ' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.homeService.search(query);
  }

  @Get('homeowner/:homeOwnerId')
  @ApiOperation({ summary: 'Lấy danh sách căn hộ theo chủ nhà' })
  @ApiParam({ name: 'homeOwnerId', description: 'ID của chủ nhà' })
  findByHomeOwner(@Param('homeOwnerId') homeOwnerId: string) {
    return this.homeService.findByHomeOwner(homeOwnerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin căn hộ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của căn hộ' })
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin căn hộ' })
  @ApiParam({ name: 'id', description: 'ID của căn hộ' })
  update(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
    return this.homeService.update(id, updateHomeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa căn hộ' })
  @ApiParam({ name: 'id', description: 'ID của căn hộ' })
  remove(@Param('id') id: string) {
    return this.homeService.remove(id);
  }
} 