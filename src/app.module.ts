import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HomeOwnerModule } from './home-owner/home-owner.module';
import { GuestModule } from './guest/guest.module';
import { HomeModule } from './home/home.module';
import { ServiceModule } from './service/service.module';
import { ReceiverModule } from './receiver/receiver.module';
import { HomeContractModule } from './home-contract/home-contract.module';
import { ServiceContractModule } from './service-contract/service-contract.module';
import { InvoicePaymentModule } from './invoice-payment/invoice-payment.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './utils/notification.module';
import { UploadModule } from './upload/upload.module';
import { GuestContractsModule } from './guest-contracts/guest-contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    HomeOwnerModule,
    GuestModule,
    HomeModule,
    ServiceModule,
    ReceiverModule,
    HomeContractModule,
    ServiceContractModule,
    InvoicePaymentModule,
    StatisticsModule,
    NotificationModule,
    UploadModule,
    GuestContractsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
