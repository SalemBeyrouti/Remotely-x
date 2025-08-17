import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seniority, SeniorityDocument } from './seniority.schema';

@Injectable()
export class SeniorityService {
  constructor(
    @InjectModel(Seniority.name) private seniorityModel: Model<SeniorityDocument>,
  ) {}

  private TOTAL_JOBS_KEY = 'TOTAL_JOBS';

  async incrementSeniority(seniorityLevel: string): Promise<void> {
    // Increment total jobs
    await this.seniorityModel.updateOne(
      { level: this.TOTAL_JOBS_KEY },
      { $inc: { count: 1 } },
      { upsert: true },
    );

    // Increment the specific seniority level
    await this.seniorityModel.updateOne(
      { level: seniorityLevel },
      { $inc: { count: 1 } },
      { upsert: true },
    );
  }

  async getTotalJobs(): Promise<number> {
    const doc = await this.seniorityModel.findOne({ level: this.TOTAL_JOBS_KEY });
    return doc?.count || 0;
  }

  async getAllSeniorityDistribution(): Promise<{ level: string; count: number; percentage: number }[]> {
    const totalJobs = await this.getTotalJobs();
    const seniorityLevels = await this.seniorityModel.find({
      level: { $ne: this.TOTAL_JOBS_KEY },
    }).lean();
    return seniorityLevels.map(level => ({
      level: level.level,
      count: level.count,
      percentage: totalJobs > 0 ? (level.count / totalJobs) * 100 : 0,
    }));
  }
}
