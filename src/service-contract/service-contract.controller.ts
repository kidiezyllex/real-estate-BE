import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceContractService } from './service-contract.service';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { UpdateServiceContractDto } from './dto/update-service-contract.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hợp đồng dịch vụ')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('service-contracts')
export class ServiceContractController {
  constructor(private readonly serviceContractService: ServiceContractService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hợp đồng dịch vụ mới' })
  create(@Body() createServiceContractDto: CreateServiceContractDto) {
    return this.serviceContractService.create(createServiceContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả hợp đồng dịch vụ' })
  findAll() {
    return this.serviceContractService.findAll();
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng dịch vụ theo căn hộ' })
  @ApiParam({ name: 'homeId', description: 'ID của căn hộ' })
  findByHome(@Param('homeId') homeId: string) {
    return this.serviceContractService.findByHome(homeId);
  }

  @Get('guest/:guestId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng dịch vụ theo khách hàng' })
  @ApiParam({ name: 'guestId', description: 'ID của khách hàng' })
  findByGuest(@Param('guestId') guestId: string) {
    return this.serviceContractService.findByGuest(guestId);
  }

  @Get('homecontract/:homeContractId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng dịch vụ theo hợp đồng nhà' })
  @ApiParam({ name: 'homeContractId', description: 'ID của hợp đồng nhà' })
  findByHomeContract(@Param('homeContractId') homeContractId: string) {
    return this.serviceContractService.findByHomeContract(homeContractId);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng dịch vụ theo dịch vụ' })
  @ApiParam({ name: 'serviceId', description: 'ID của dịch vụ' })
  findByService(@Param('serviceId') serviceId: string) {
    return this.serviceContractService.findByService(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin hợp đồng dịch vụ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng dịch vụ' })
  findOne(@Param('id') id: string) {
    return this.serviceContractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin hợp đồng dịch vụ' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng dịch vụ' })
  update(@Param('id') id: string, @Body() updateServiceContractDto: UpdateServiceContractDto) {
    return this.serviceContractService.update(id, updateServiceContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hợp đồng dịch vụ' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng dịch vụ' })
  remove(@Param('id') id: string) {
    return this.serviceContractService.remove(id);
  }
} 