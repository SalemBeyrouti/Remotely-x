import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillCorrelation, SkillCorrelationDocument } from './skill-correlation.schema';

@Injectable()
export class SkillCorrelationService {
  constructor(
    @InjectModel(SkillCorrelation.name) private skillCorrelationModel: Model<SkillCorrelationDocument>,
  ) {}

  private TOTAL_JOBS_KEY = 'TOTAL_JOBS';

  async incrementSkillPairs(skills: string[]): Promise<void> {
    // Increment total jobs
    await this.skillCorrelationModel.updateOne(
      { skillA: this.TOTAL_JOBS_KEY, skillB: this.TOTAL_JOBS_KEY },
      { $inc: { count: 1 } },
      { upsert: true },
    );

    // For each unique skill pair (sorted), increment their count
    const uniquePairs = new Set<string>();
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const [a, b] = [skills[i], skills[j]].sort();
        uniquePairs.add(`${a}|||${b}`);
      }
    }
    for (const pair of uniquePairs) {
      const [skillA, skillB] = pair.split('|||');
      await this.skillCorrelationModel.updateOne(
        { skillA, skillB },
        { $inc: { count: 1 } },
        { upsert: true },
      );
    }
  }

  async getTotalJobs(): Promise<number> {
    const doc = await this.skillCorrelationModel.findOne({ skillA: this.TOTAL_JOBS_KEY, skillB: this.TOTAL_JOBS_KEY });
    return doc?.count || 0;
  }

  async getAllCorrelations(): Promise<{ skillA: string; skillB: string; count: number; correlation: number }[]> {
    const totalJobs = await this.getTotalJobs();
    const pairs = await this.skillCorrelationModel.find({
      skillA: { $ne: this.TOTAL_JOBS_KEY },
      skillB: { $ne: this.TOTAL_JOBS_KEY },
    }).lean();
    return pairs.map(pair => ({
      skillA: pair.skillA,
      skillB: pair.skillB,
      count: pair.count,
      correlation: totalJobs > 0 ? pair.count / totalJobs : 0,
    }));
  }
}
