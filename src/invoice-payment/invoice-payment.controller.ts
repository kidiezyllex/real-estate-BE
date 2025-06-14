import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InvoicePaymentService } from './invoice-payment.service';
import { CreateInvoicePaymentDto } from './dto/create-invoice-payment.dto';
import { UpdateInvoicePaymentDto } from './dto/update-invoice-payment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hóa đơn thanh toán')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('invoice-payments')
export class InvoicePaymentController {
  constructor(private readonly invoicePaymentService: InvoicePaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hóa đơn thanh toán mới' })
  create(@Body() createInvoicePaymentDto: CreateInvoicePaymentDto) {
    return this.invoicePaymentService.create(createInvoicePaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả hóa đơn thanh toán' })
  findAll() {
    return this.invoicePaymentService.findAll();
  }

  @Get('due')
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn sắp đến hạn thanh toán' })
  findDuePayments() {
    return this.invoicePaymentService.findDuePayments();
  }

  @Get('home-contract/:homeContractId')
  @ApiOperation({
    summary: 'Lấy danh sách hóa đơn thanh toán theo hợp đồng nhà',
  })
  @ApiParam({ name: 'homeContractId', description: 'ID của hợp đồng nhà' })
  findByHomeContract(@Param('homeContractId') homeContractId: string) {
    return this.invoicePaymentService.findByHomeContract(homeContractId);
  }

  @Get('service-contract/:serviceContractId')
  @ApiOperation({
    summary: 'Lấy danh sách hóa đơn thanh toán theo hợp đồng dịch vụ',
  })
  @ApiParam({
    name: 'serviceContractId',
    description: 'ID của hợp đồng dịch vụ',
  })
  findByServiceContract(@Param('serviceContractId') serviceContractId: string) {
    return this.invoicePaymentService.findByServiceContract(serviceContractId);
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn thanh toán theo căn hộ' })
  @ApiParam({ name: 'homeId', description: 'ID của căn hộ' })
  findByHome(@Param('homeId') homeId: string) {
    return this.invoicePaymentService.findByHome(homeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin hóa đơn thanh toán theo ID' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn thanh toán' })
  findOne(@Param('id') id: string) {
    return this.invoicePaymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin hóa đơn thanh toán' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn thanh toán' })
  update(
    @Param('id') id: string,
    @Body() updateInvoicePaymentDto: UpdateInvoicePaymentDto,
  ) {
    return this.invoicePaymentService.update(id, updateInvoicePaymentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái thanh toán của hóa đơn' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn thanh toán' })
  @ApiQuery({
    name: 'status',
    description: 'Trạng thái thanh toán (1: Chưa thanh toán, 2: Đã thanh toán)',
  })
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.invoicePaymentService.updatePaymentStatus(id, parseInt(status));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hóa đơn thanh toán' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn thanh toán' })
  remove(@Param('id') id: string) {
    return this.invoicePaymentService.remove(id);
  }

  @Post('generate/home-contract/:homeContractId')
  @ApiOperation({ summary: 'Tạo tự động các đợt thanh toán cho hợp đồng nhà' })
  @ApiParam({ name: 'homeContractId', description: 'ID của hợp đồng nhà' })
  generatePaymentsForHomeContract(
    @Param('homeContractId') homeContractId: string,
  ) {
    return this.invoicePaymentService.generatePaymentsForHomeContract(
      homeContractId,
    );
  }

  @Post('generate/service-contract/:serviceContractId')
  @ApiOperation({
    summary: 'Tạo tự động các đợt thanh toán cho hợp đồng dịch vụ',
  })
  @ApiParam({
    name: 'serviceContractId',
    description: 'ID của hợp đồng dịch vụ',
  })
  generatePaymentsForServiceContract(
    @Param('serviceContractId') serviceContractId: string,
  ) {
    return this.invoicePaymentService.generatePaymentsForServiceContract(
      serviceContractId,
    );
  }
}
