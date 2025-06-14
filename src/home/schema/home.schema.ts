import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HomeOwner } from '../../home-owner/schema/home-owner.schema';
import { HomeContract } from '../../home-contract/schema/home-contract.schema';

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
  province: string;

  @Prop()
  building: string;

  @Prop()
  apartmentNv: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HomeOwner',
    required: true,
  })
  homeOwnerId: HomeOwner;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HomeContract',
    default: null,
  })
  homeContract: HomeContract;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  note: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  // Apartment amenities - Tiện ích căn hộ
  @Prop({ default: false })
  hasBathroom: boolean; // Phòng tắm

  @Prop({ default: false })
  hasBedroom: boolean; // Phòng ngủ

  @Prop({ default: false })
  hasBalcony: boolean; // Ban công

  @Prop({ default: false })
  hasKitchen: boolean; // Nhà bếp

  @Prop({ default: false })
  hasWifi: boolean; // Wifi

  @Prop({ default: false })
  hasSoundproof: boolean; // Chống tiếng ồn

  @Prop({ default: false })
  hasAirConditioner: boolean; // Điều hòa

  @Prop({ default: false })
  hasWashingMachine: boolean; // Máy giặt

  @Prop({ default: false })
  hasRefrigerator: boolean; // Tủ lạnh

  @Prop({ default: false })
  hasElevator: boolean; // Thang máy

  @Prop({ default: false })
  hasParking: boolean; // Chỗ đậu xe

  @Prop({ default: false })
  hasSecurity: boolean; // An ninh 24/7

  @Prop({ default: false })
  hasGym: boolean; // Phòng gym

  @Prop({ default: false })
  hasSwimmingPool: boolean; // Hồ bơi

  @Prop({ default: false })
  hasGarden: boolean; // Khu vườn

  @Prop({ default: false })
  hasPetAllowed: boolean; // Cho phép nuôi thú cưng
}

export const HomeSchema = SchemaFactory.createForClass(Home);
