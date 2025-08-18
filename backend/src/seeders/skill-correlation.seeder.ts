import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillCorrelation } from '../skill-correlation/skill-correlation.schema';

@Injectable()
export class SkillCorrelationSeeder {
  constructor(
    @InjectModel(SkillCorrelation.name) private readonly skillCorrelationModel: Model<SkillCorrelation>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.skillCorrelationModel.countDocuments();
    if (count > 0) {
      console.log('Skill correlation data already seeded, skipping...');
      return;
    }

    const sampleData = [
      {
        skillA: 'TOTAL_JOBS',
        skillB: 'TOTAL_JOBS',
        count: 3
      },
      {
        skillA: 'JavaScript',
        skillB: 'React',
        count: 2
      },
      {
        skillA: 'JavaScript',
        skillB: 'TypeScript',
        count: 2
      },
      {
        skillA: 'React',
        skillB: 'TypeScript',
        count: 2
      },
      {
        skillA: 'JavaScript',
        skillB: 'Node.js',
        count: 1
      },
      {
        skillA: 'JavaScript',
        skillB: 'MongoDB',
        count: 1
      },
      {
        skillA: 'React',
        skillB: 'Node.js',
        count: 1
      },
      {
        skillA: 'React',
        skillB: 'MongoDB',
        count: 1
      },
      {
        skillA: 'TypeScript',
        skillB: 'Node.js',
        count: 1
      },
      {
        skillA: 'TypeScript',
        skillB: 'MongoDB',
        count: 1
      },
      {
        skillA: 'Python',
        skillB: 'Django',
        count: 1
      },
      {
        skillA: 'Python',
        skillB: 'PostgreSQL',
        count: 1
      },
      {
        skillA: 'Django',
        skillB: 'PostgreSQL',
        count: 1
      },
      {
        skillA: 'Docker',
        skillB: 'Git',
        count: 1
      }
    ];

    await this.skillCorrelationModel.insertMany(sampleData);
    console.log(`Seeded ${sampleData.length} skill correlation records`);
  }

  async clear(): Promise<void> {
    await this.skillCorrelationModel.deleteMany({});
    console.log('Cleared all skill correlation data');
  }
}
