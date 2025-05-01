import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HomeOwner } from '../../home-owner/schema/home-owner.schema';

export type HomeDocument = Home & Document;

@Schema({ timestamps: true })
export class Home {
  @Prop({ required: true })
  address: string;

  @Prop()
  district: string;
  
  @Prop()
  ward: string;
  
  @Prop()
  building: string;
  
  @Prop()
  apartmentNv: string;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'HomeOwner', required: true })
  homeOwnerId: HomeOwner;
  
  @Prop({ default: true })
  active: boolean;
  
  @Prop()
  note: string;
}

export const HomeSchema = SchemaFactory.createForClass(Home); 