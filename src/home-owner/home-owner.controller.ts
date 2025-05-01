import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HomeOwnerService } from './home-owner.service';
import { CreateHomeOwnerDto } from './dto/create-home-owner.dto';
import { UpdateHomeOwnerDto } from './dto/update-home-owner.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chủ nhà')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('home-owners')
export class HomeOwnerController {
  constructor(private readonly homeOwnerService: HomeOwnerService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chủ nhà mới' })
  create(@Body() createHomeOwnerDto: CreateHomeOwnerDto) {
    return this.homeOwnerService.create(createHomeOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả chủ nhà' })
  findAll() {
    return this.homeOwnerService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm chủ nhà' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.homeOwnerService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chủ nhà theo ID' })
  @ApiParam({ name: 'id', description: 'ID của chủ nhà' })
  findOne(@Param('id') id: string) {
    return this.homeOwnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin chủ nhà' })
  @ApiParam({ name: 'id', description: 'ID của chủ nhà' })
  update(@Param('id') id: string, @Body() updateHomeOwnerDto: UpdateHomeOwnerDto) {
    return this.homeOwnerService.update(id, updateHomeOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chủ nhà' })
  @ApiParam({ name: 'id', description: 'ID của chủ nhà' })
  remove(@Param('id') id: string) {
    return this.homeOwnerService.remove(id);
  }
} 