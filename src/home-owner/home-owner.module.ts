import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeOwner, HomeOwnerSchema } from './schema/home-owner.schema';
import { HomeOwnerService } from './home-owner.service';
import { HomeOwnerController } from './home-owner.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeOwner.name, schema: HomeOwnerSchema },
    ]),
  ],
  controllers: [HomeOwnerController],
  providers: [HomeOwnerService],
  exports: [HomeOwnerService],
})
export class HomeOwnerModule {} 