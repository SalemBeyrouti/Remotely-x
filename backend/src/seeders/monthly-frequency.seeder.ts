import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonthlyFrequency } from '../monthly-frequency/monthly-frequency.schema';

@Injectable()
export class MonthlyFrequencySeeder {
  constructor(
    @InjectModel(MonthlyFrequency.name) private readonly monthlyFrequencyModel: Model<MonthlyFrequency>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.monthlyFrequencyModel.countDocuments();
    if (count > 0) {
      console.log('Monthly frequency data already seeded, skipping...');
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

    const sampleData = [
      {
        level: 'Total Jobs',
        count: 3
      },
      {
        level: 'JavaScript',
        count: 2
      },
      {
        level: 'React',
        count: 2
      },
      {
        level: 'TypeScript',
        count: 2
      },
      {
        level: 'Python',
        count: 1
      },
      {
        level: 'Node.js',
        count: 1
      },
      {
        level: 'MongoDB',
        count: 1
      },
      {
        level: 'Django',
        count: 1
      },
      {
        level: 'PostgreSQL',
        count: 1
      },
      {
        level: 'Docker',
        count: 1
      },
      {
        level: 'Git',
        count: 1
      }
    ];

    await this.monthlyFrequencyModel.insertMany(sampleData);
    console.log(`Seeded ${sampleData.length} monthly frequency records`);
  }

  async clear(): Promise<void> {
    await this.monthlyFrequencyModel.deleteMany({});
    console.log('Cleared all monthly frequency data');
  }
}
