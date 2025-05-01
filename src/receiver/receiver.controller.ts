import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Người nhận')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('receivers')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người nhận mới' })
  create(@Body() createReceiverDto: CreateReceiverDto) {
    return this.receiverService.create(createReceiverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người nhận' })
  findAll() {
    return this.receiverService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm người nhận' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  search(@Query('q') query: string) {
    return this.receiverService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người nhận theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người nhận' })
  findOne(@Param('id') id: string) {
    return this.receiverService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người nhận' })
  @ApiParam({ name: 'id', description: 'ID của người nhận' })
  update(@Param('id') id: string, @Body() updateReceiverDto: UpdateReceiverDto) {
    return this.receiverService.update(id, updateReceiverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người nhận' })
  @ApiParam({ name: 'id', description: 'ID của người nhận' })
  remove(@Param('id') id: string) {
    return this.receiverService.remove(id);
  }
} 