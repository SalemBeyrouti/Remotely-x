import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seniority, SeniorityDocument } from './seniority.schema';
import { Job } from '../jobs/schemas/job.schema';

@Injectable()
export class SeniorityService {
  constructor(
    @InjectModel(Seniority.name) private seniorityModel: Model<SeniorityDocument>,
  ) {}

  async incrementSeniority(seniorityLevel: string): Promise<void> {
    await this.seniorityModel.updateOne(
      { level: seniorityLevel },
      { $inc: { count: 1 } },
      { upsert: true },
    );
  }

  async onJobCreated(job: Partial<Job>): Promise<void> {
    if (!job.seniority_level) return;
    await this.incrementSeniority(job.seniority_level);
  }

  async getAllSeniorityDistribution(): Promise<Array<{ industry: string; count: number }>> {
    const docs = await this.seniorityModel.find().lean();
    return docs
      .filter(d => d.level !== 'TOTAL_JOBS')
      .map(d => ({ industry: d.level, count: d.count }));
  }
}
