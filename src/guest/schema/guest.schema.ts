import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuestDocument = Guest & Document;

@Schema({ timestamps: true })
export class Guest {
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
  hometown: string;
  
  @Prop()
  note: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest); 