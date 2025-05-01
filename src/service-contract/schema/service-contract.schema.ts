import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Service } from '../../service/schema/service.schema';
import { Home } from '../../home/schema/home.schema';
import { Guest } from '../../guest/schema/guest.schema';
import { HomeContract } from '../../home-contract/schema/home-contract.schema';

export type ServiceContractDocument = ServiceContract & Document;

@Schema()
export class ServiceContract {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
  serviceId: Service;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Home', required: true })
  homeId: Home;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Guest', required: true })
  guestId: Guest;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'HomeContract' })
  homeContractStk: HomeContract;
  
  @Prop({ required: true })
  signDate: Date;
  
  @Prop({ required: true })
  payCycle: number;
  
  @Prop({ required: true })
  duration: number;
  
  @Prop({ required: true, type: Number })
  unitCost: number;
  
  @Prop({ default: 1 })
  statusContrac: number;
  
  @Prop({ required: true })
  dateStar: Date;
  
  @Prop({ required: true })
  dateEnd: Date;
  
  @Prop({ default: 0 })
  limit: number;
  
  @Prop()
  createdAt: Date;
}

export const ServiceContractSchema = SchemaFactory.createForClass(ServiceContract); 