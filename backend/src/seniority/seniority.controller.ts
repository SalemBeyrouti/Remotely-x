import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seniority, SeniorityDocument } from './seniority.schema';

@Controller('jobs/analytics')
export class SeniorityAnalyticsController {
  constructor(
    @InjectModel(Seniority.name) private seniorityModel: Model<SeniorityDocument>,
  ) {}

  @Get('seniority')
  async getSeniorityDistribution(): Promise<Array<{ industry: string; count: number }>> {
    const docs = await this.seniorityModel.find().lean();
    return docs
      .filter(d => d.level !== 'TOTAL_JOBS')
      .map(d => ({ industry: d.level, count: d.count }));
  }
}
