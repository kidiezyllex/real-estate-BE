import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GuestContractsService } from './guest-contracts.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hợp đồng khách hàng')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('guest-contracts')
export class GuestContractsController {
  constructor(private readonly guestContractsService: GuestContractsService) {}

  @Get(':guestId')
  @ApiOperation({ summary: 'Lấy tất cả hợp đồng (thuê nhà và dịch vụ) của khách hàng' })
  @ApiParam({ name: 'guestId', description: 'ID của khách hàng' })
  findAllContractsByGuest(@Param('guestId') guestId: string) {
    return this.guestContractsService.findAllContractsByGuest(guestId);
  }
} 