import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Receiver, ReceiverSchema } from './schema/receiver.schema';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Receiver.name, schema: ReceiverSchema },
    ]),
  ],
  controllers: [ReceiverController],
  providers: [ReceiverService],
  exports: [ReceiverService],
})
export class ReceiverModule {}
