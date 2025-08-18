import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './schemas/job.schema';
import { TrendsService } from '../trends/trends.service';
import { SalariesService } from '../salaries/salaries.service';
import { SeniorityService } from '../seniority/seniority.service';
import { SkillCountService } from '../skill-count/skill-count.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    private readonly trendsService: TrendsService,
    private readonly salariesService: SalariesService,
    private readonly seniorityService: SeniorityService,
    private readonly skillCountService: SkillCountService,
  ) {}

  async createJob(data: Partial<Job>): Promise<Job> {
    const createdJob = new this.jobModel(data);
    const saved = await createdJob.save();
    // update analytics asynchronously (best-effort)
    Promise.all([
      this.trendsService.onJobCreated(saved),
      this.salariesService.onJobCreated(saved),
      this.seniorityService.onJobCreated(saved),
      this.skillCountService.onJobCreated(saved),
    ]).catch(() => {});
    return saved;
  }

  async createBulkJobs(jobs: any[]): Promise<Job[]> {
    const result = await this.jobModel.insertMany(jobs);
    await Promise.all(result.map(j => Promise.all([
      this.trendsService.onJobCreated(j),
      this.salariesService.onJobCreated(j),
      this.seniorityService.onJobCreated(j),
      this.skillCountService.onJobCreated(j),
    ]).catch(() => {})));
    return result as Job[];
  }

  async getAllJobs(filters?: any): Promise<Job[]> {
    const query = this.jobModel.find();
    
    if (filters) {
      if (filters.seniority_level) query.where('seniority_level', filters.seniority_level);
      if (filters.employment_type) query.where('employment_type', filters.employment_type);
      if (filters.remote !== undefined) query.where('remote', filters.remote);
      if (filters.compensation_currency) query.where('compensation_currency', filters.compensation_currency);
      if (filters.limit) query.limit(parseInt(filters.limit));
      if (filters.skip) query.skip(parseInt(filters.skip));
    }
    
    return query.exec();
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobModel.findById(id).exec();
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job | null> {
    return this.jobModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteJob(id: string): Promise<void> {
    await this.jobModel.findByIdAndDelete(id).exec();
  }

  async searchJobs(searchTerm: string): Promise<Job[]> {
    return this.jobModel.find({
      $or: [
        { job_title: { $regex: searchTerm, $options: 'i' } },
        { role_overview: { $regex: searchTerm, $options: 'i' } },
        { skills: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    }).exec();
  }

  async getMarketTrends() {
    const totalJobs = await this.jobModel.countDocuments();
    const remoteJobs = await this.jobModel.countDocuments({ remote: true });
    const avgSalary = await this.jobModel.aggregate([
      { $match: { compensation_min: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$compensation_min' } } }
    ]);
    
    const seniorityDistribution = await this.jobModel.aggregate([
      { $group: { _id: '$seniority_level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const employmentTypeDistribution = await this.jobModel.aggregate([
      { $group: { _id: '$employment_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    return {
      totalJobs,
      remoteJobs,
      remotePercentage: totalJobs > 0 ? (remoteJobs / totalJobs) * 100 : 0,
      averageSalary: avgSalary[0]?.avg || 0,
      seniorityDistribution,
      employmentTypeDistribution
    };
  }

  async getSkillsAnalysis() {
    return this.jobModel.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
  }

  async getSalaryAnalysis() {
    return this.jobModel.aggregate([
      { $match: { compensation_min: { $exists: true } } },
      { $group: { 
        _id: '$compensation_currency', 
        avgMin: { $avg: '$compensation_min' },
        avgMax: { $avg: '$compensation_max' },
        count: { $sum: 1 },
        minSalary: { $min: '$compensation_min' },
        maxSalary: { $max: '$compensation_max' }
      }}
    ]);
  }

  async getLocationAnalysis() {
    // This would work if you add location field to schema
    return this.jobModel.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }

  async getSeniorityAnalysis() {
    return this.jobModel.aggregate([
      { $group: { _id: '$seniority_level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }

  async getRecentJobs(limit: number = 10): Promise<Job[]> {
    return this.jobModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  async getJobsBySeniority(seniority: string): Promise<Job[]> {
    return this.jobModel.find({ seniority_level: seniority }).exec();
  }

  async getRemoteJobs(): Promise<Job[]> {
    return this.jobModel.find({ remote: true }).exec();
  }
}
