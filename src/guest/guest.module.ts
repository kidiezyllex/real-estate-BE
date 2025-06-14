import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from './schema/guest.schema';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { GuestMigrationService } from './guest-migration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  controllers: [GuestController],
  providers: [GuestService, GuestMigrationService],
  exports: [GuestService, GuestMigrationService],
})
export class GuestModule {}
