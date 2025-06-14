import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HomeContract,
  HomeContractSchema,
} from './schema/home-contract.schema';
import { HomeContractService } from './home-contract.service';
import { HomeContractController } from './home-contract.controller';
import { GuestModule } from '../guest/guest.module';
import { HomeModule } from '../home/home.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeContract.name, schema: HomeContractSchema },
    ]),
    GuestModule,
    HomeModule,
  ],
  controllers: [HomeContractController],
  providers: [HomeContractService],
  exports: [HomeContractService],
})
export class HomeContractModule {}
