import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReceiverDocument = Receiver & Document;

@Schema()
export class Receiver {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  taxcode: string;

  @Prop()
  bankAccount: string;

  @Prop()
  bankNumber: string;

  @Prop()
  bank: string;

  @Prop()
  type: number;

  @Prop()
  note: string;
}

export const ReceiverSchema = SchemaFactory.createForClass(Receiver);
