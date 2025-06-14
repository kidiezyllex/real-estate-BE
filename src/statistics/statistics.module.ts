import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvoicePayment,
  InvoicePaymentSchema,
} from '../invoice-payment/schema/invoice-payment.schema';
import {
  HomeContract,
  HomeContractSchema,
} from '../home-contract/schema/home-contract.schema';
import {
  ServiceContract,
  ServiceContractSchema,
} from '../service-contract/schema/service-contract.schema';
import { Home, HomeSchema } from '../home/schema/home.schema';
import { Guest, GuestSchema } from '../guest/schema/guest.schema';
import {
  HomeOwner,
  HomeOwnerSchema,
} from '../home-owner/schema/home-owner.schema';
import { Service, ServiceSchema } from '../service/schema/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvoicePayment.name, schema: InvoicePaymentSchema },
      { name: HomeContract.name, schema: HomeContractSchema },
      { name: ServiceContract.name, schema: ServiceContractSchema },
      { name: Home.name, schema: HomeSchema },
      { name: Guest.name, schema: GuestSchema },
      { name: HomeOwner.name, schema: HomeOwnerSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
