import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guest, GuestDocument } from './schema/guest.schema';

@Injectable()
export class GuestMigrationService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
  ) {}

  async updateExistingGuestsWithMissingFields(): Promise<void> {
    try {
      // Update all guests that don't have gender field set
      await this.guestModel.updateMany(
        { gender: { $exists: false } },
        { $set: { gender: null } },
      );

      // Update all guests that don't have avatarUrl field set
      await this.guestModel.updateMany(
        { avatarUrl: { $exists: false } },
        { $set: { avatarUrl: null } },
      );
    } catch (error) {
      throw error;
    }
  }
}
