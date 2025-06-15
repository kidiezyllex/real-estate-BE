import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HomeContract } from '../../home-contract/schema/home-contract.schema';
import { Home } from '../../home/schema/home.schema';
import { Receiver } from '../../receiver/schema/receiver.schema';
import { ServiceContract } from '../../service-contract/schema/service-contract.schema';

export type InvoicePaymentDocument = InvoicePayment & Document;

@Schema({ timestamps: true })
export class InvoicePayment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'HomeContract' })
  homeContractId: HomeContract;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Home', required: true })
  homeId: Home;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ServiceContract' })
  serviceContractId: ServiceContract;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Receiver' })
  receiverId: Receiver;

  @Prop({ required: true })
  type: number;

  @Prop()
  datePaymentRemind: Date;

  @Prop()
  datePaymentExpec: Date;

  @Prop()
  datePaymentReal: Date;

  @Prop({ required: true })
  dateStar: Date;

  @Prop({ required: true })
  dateEnd: Date;

  @Prop({ default: 0 })
  statusPaym: number;

  @Prop({ type: Number, default: 0 })
  totalReceive: number;

  @Prop({ type: Number, default: 0 })
  totalSend: number;

  @Prop()
  note: string;
}

export const InvoicePaymentSchema =
  SchemaFactory.createForClass(InvoicePayment);
