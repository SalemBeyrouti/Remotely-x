import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonthlyFrequency, MonthlyFrequencyDocument } from './monthly-frequency.schema';

@Injectable()
export class MonthlyFrequencyService {
  constructor(
    @InjectModel(MonthlyFrequency.name) private monthlyFrequencyModel: Model<MonthlyFrequencyDocument>,
  ) {}

  async incrementSkill(skill: string, month: string): Promise<void> {
    await this.monthlyFrequencyModel.updateOne(
      { name: skill },
      { $inc: { [`monthlyCounts.${month}`]: 1 } },
      { upsert: true },
    );
  }

  async incrementTotalJobs(month: string): Promise<void> {
    await this.incrementSkill('Total Jobs', month);
  }

  async getSkillStats(skill: string): Promise<MonthlyFrequency | null> {
    return this.monthlyFrequencyModel.findOne({ name: skill }).lean();
  }

  async getAllStats(): Promise<MonthlyFrequency[]> {
    return this.monthlyFrequencyModel.find().lean();
  }
}
