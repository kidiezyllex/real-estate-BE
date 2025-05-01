import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceContract, ServiceContractSchema } from './schema/service-contract.schema';
import { ServiceContractService } from './service-contract.service';
import { ServiceContractController } from './service-contract.controller';
import { GuestModule } from '../guest/guest.module';
import { HomeModule } from '../home/home.module';
import { ServiceModule } from '../service/service.module';
import { HomeContractModule } from '../home-contract/home-contract.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceContract.name, schema: ServiceContractSchema },
    ]),
    GuestModule,
    HomeModule,
    ServiceModule,
    HomeContractModule,
  ],
  controllers: [ServiceContractController],
  providers: [ServiceContractService],
  exports: [ServiceContractService],
})
export class ServiceContractModule {} 