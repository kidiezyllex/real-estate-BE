import { Module } from '@nestjs/common';
import { GuestContractsController } from './guest-contracts.controller';
import { GuestContractsService } from './guest-contracts.service';
import { HomeContractModule } from '../home-contract/home-contract.module';
import { ServiceContractModule } from '../service-contract/service-contract.module';
import { GuestModule } from '../guest/guest.module';

@Module({
  imports: [HomeContractModule, ServiceContractModule, GuestModule],
  controllers: [GuestContractsController],
  providers: [GuestContractsService],
  exports: [GuestContractsService],
})
export class GuestContractsModule {}
