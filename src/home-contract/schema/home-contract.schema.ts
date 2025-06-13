import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Guest } from '../../guest/schema/guest.schema';
import { Home } from '../../home/schema/home.schema';

export type HomeContractDocument = HomeContract & Document;

@Schema({ timestamps: true })
export class HomeContract {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Guest', required: true })
  guestId: Guest;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Home', required: true })
  homeId: Home;
  
  @Prop()
  contractCode: string;
  
  @Prop({ required: true })
  duration: number;
  
  @Prop({ required: true })
  payCycle: number;
  
  @Prop({ required: true, type: Number })
  renta: number;
  
  @Prop({ required: true })
  dateStar: Date;
  
  @Prop({ type: Number })
  deposit: number;
  
  @Prop({ default: 1 })
  status: number;
}

export const HomeContractSchema = SchemaFactory.createForClass(HomeContract); 