import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seniority } from '../seniority/seniority.schema';

@Injectable()
export class SenioritySeeder {
  constructor(
    @InjectModel(Seniority.name) private readonly seniorityModel: Model<Seniority>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.seniorityModel.countDocuments();
    if (count > 0) {
      console.log('Seniority data already seeded, skipping...');
      return;
    }

    const sampleData = [
      {
        level: 'TOTAL_JOBS',
        count: 3
      },
      {
        level: 'Senior',
        count: 1
      },
      {
        level: 'Mid-level',
        count: 1
      },
      {
        level: 'Junior',
        count: 1
      }
    ];

    await this.seniorityModel.insertMany(sampleData);
    console.log(`Seeded ${sampleData.length} seniority records`);
  }

  async clear(): Promise<void> {
    await this.seniorityModel.deleteMany({});
    console.log('Cleared all seniority data');
  }
}
