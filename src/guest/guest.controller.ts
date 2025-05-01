import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Khách hàng')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo khách hàng mới' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả khách hàng' })
  findAll() {
    return this.guestService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm khách hàng' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.guestService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin khách hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của khách hàng' })
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
  @ApiParam({ name: 'id', description: 'ID của khách hàng' })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khách hàng' })
  @ApiParam({ name: 'id', description: 'ID của khách hàng' })
  remove(@Param('id') id: string) {
    return this.guestService.remove(id);
  }
} 