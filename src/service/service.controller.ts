import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Dịch vụ')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả dịch vụ' })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm dịch vụ' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.serviceService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin dịch vụ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin dịch vụ' })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
} 