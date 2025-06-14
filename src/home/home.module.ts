import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Home, HomeSchema } from './schema/home.schema';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeOwnerModule } from '../home-owner/home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Home.name, schema: HomeSchema }]),
    HomeOwnerModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
