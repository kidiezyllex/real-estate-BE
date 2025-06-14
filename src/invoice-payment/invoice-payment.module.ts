import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvoicePayment,
  InvoicePaymentSchema,
} from './schema/invoice-payment.schema';
import { InvoicePaymentService } from './invoice-payment.service';
import { InvoicePaymentController } from './invoice-payment.controller';
import { HomeContractModule } from '../home-contract/home-contract.module';
import { HomeModule } from '../home/home.module';
import { ServiceContractModule } from '../service-contract/service-contract.module';
import { ReceiverModule } from '../receiver/receiver.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvoicePayment.name, schema: InvoicePaymentSchema },
    ]),
    HomeContractModule,
    HomeModule,
    ServiceContractModule,
    ReceiverModule,
  ],
  controllers: [InvoicePaymentController],
  providers: [InvoicePaymentService],
  exports: [InvoicePaymentService],
})
export class InvoicePaymentModule {}
