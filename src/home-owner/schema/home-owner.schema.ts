import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeOwnerDocument = HomeOwner & Document;

@Schema({ timestamps: true })
export class HomeOwner {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  phone: string;
  
  @Prop()
  email: string;
  
  @Prop()
  citizenId: string;
  
  @Prop()
  citizen_date: Date;
  
  @Prop()
  citizen_place: string;
  
  @Prop()
  birthday: Date;
  
  @Prop()
  bank: string;
  
  @Prop()
  bankAccount: string;
  
  @Prop()
  bankNumber: string;
  
  @Prop()
  metaAccessToken: string;
  
  @Prop()
  metaAccessTokenExpireDat: Date;
  
  @Prop({ default: true })
  active: boolean;
  
  @Prop()
  note: string;
}

export const HomeOwnerSchema = SchemaFactory.createForClass(HomeOwner); 