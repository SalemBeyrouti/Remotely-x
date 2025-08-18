import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Job } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createJob(data: Partial<Job>): Promise<Job> {
    const createdJob = new this.jobModel(data);
    return createdJob.save();
  }

  async createBulkJobs(jobs: any[]): Promise<Job[]> {
    const result = await this.jobModel.insertMany(jobs);
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
        { requirements: { $in: [new RegExp(searchTerm, 'i')] } }
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
      { $unwind: '$requirements' },
      { $group: { _id: '$requirements', count: { $sum: 1 } } },
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

  // ===== n8n Scraped Data Methods =====
  private get scrapedJobsCollection() {
    return this.connection.collection('scrappeddata');
  }

  async getScrapedJobs(filters?: any): Promise<any[]> {
    const query: any = {};
    
    if (filters) {
      if (filters.scraper_status) query.scraper_status = filters.scraper_status;
      if (filters.job_type) query.job_type = filters.job_type;
      if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
      if (filters.company) query.company = { $regex: filters.company, $options: 'i' };
      if (filters.salary_min) query.salary = { $regex: new RegExp(`\\b${filters.salary_min}`, 'i') };
    }
    
    let cursor = this.scrapedJobsCollection.find(query);
    
    if (filters?.limit) cursor = cursor.limit(parseInt(filters.limit));
    if (filters?.skip) cursor = cursor.skip(parseInt(filters.skip));
    
    return cursor.toArray();
  }

  async getScrapedJobById(id: string): Promise<any> {
    const { ObjectId } = require('mongodb');
    return this.scrapedJobsCollection.findOne({ _id: new ObjectId(id) });
  }

  async getRecentScrapedJobs(limit: number = 10): Promise<any[]> {
    return this.scrapedJobsCollection
      .find({})
      .sort({ last_scraped: -1 })
      .limit(limit)
      .toArray();
  }

  async getSuccessfulScrapedJobs(): Promise<any[]> {
    return this.scrapedJobsCollection
      .find({ scraper_status: 'success' })
      .sort({ last_scraped: -1 })
      .toArray();
  }

  async getFailedScrapedJobs(): Promise<any[]> {
    return this.scrapedJobsCollection
      .find({ scraper_status: { $in: ['failed', 'error'] } })
      .sort({ last_scraped: -1 })
      .toArray();
  }

  async syncScrapedJobsToMain(): Promise<{ synced: number; errors: any[] }> {
    const successfulScrapedJobs = await this.getSuccessfulScrapedJobs();
    let syncedCount = 0;
    const errors: any[] = [];

    for (const scrapedJob of successfulScrapedJobs) {
      try {
        // Check if job already exists by job title (since URL field doesn't exist in schema)
        const existingJob = await this.jobModel.findOne({ 
          job_title: scrapedJob.job_title,
          compensation_notes: { $regex: scrapedJob.url } 
        });
        
        if (!existingJob) {
          // Map scraped data to Job schema format (only use fields that exist in schema)
          const jobData: Partial<Job> = {
            job_title: scrapedJob.job_title,
            role_overview: scrapedJob.description || scrapedJob.job_description_summary,
            requirements: this.parseRequirements(scrapedJob.skills || scrapedJob.requirements),
            seniority_level: this.mapExperienceToSeniority(scrapedJob.experience),
            employment_type: this.mapJobType(scrapedJob.job_type),
            remote: scrapedJob.remote_status?.toLowerCase() === 'remote',
            compensation_min: this.parseSalary(scrapedJob.salary)?.min,
            compensation_max: this.parseSalary(scrapedJob.salary)?.max,
            compensation_currency: scrapedJob.currency || 'USD',
            schedule_hours_local: scrapedJob.working_hours,
            work_days: scrapedJob.working_days,
            days_off: scrapedJob.days_off,
            benefits: scrapedJob.benefits,
            responsibilities: scrapedJob.responsibilities,
            compensation_notes: `Scraped from: ${scrapedJob.url} on ${scrapedJob.last_scraped}`,
          };

          await this.createJob(jobData);
          syncedCount++;
        }
      } catch (error) {
        errors.push({ url: scrapedJob.url, error: error.message });
      }
    }

    return { synced: syncedCount, errors };
  }

  // Helper methods for data mapping
  private parseRequirements(skillsString: string): string[] {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  private mapExperienceToSeniority(experience: string): string {
    if (!experience) return 'Mid-level';
    const exp = experience.toLowerCase();
    
    if (exp.includes('junior') || exp.includes('entry') || exp.includes('0-2') || exp.includes('1 year')) {
      return 'Junior';
    }
    if (exp.includes('senior') || exp.includes('lead') || exp.includes('5+') || exp.includes('7+')) {
      return 'Senior';
    }
    return 'Mid-level';
  }

  private mapJobType(jobType: string): string {
    if (!jobType) return 'Full-time';
    const type = jobType.toLowerCase();
    
    if (type.includes('part')) return 'Part-time';
    if (type.includes('contract') || type.includes('freelance')) return 'Contract';
    if (type.includes('intern')) return 'Internship';
    
    return 'Full-time';
  }

  private parseSalary(salaryString: string): { min?: number; max?: number } | null {
    if (!salaryString) return null;
    
    // Remove currency symbols and commas
    const cleanSalary = salaryString.replace(/[$,]/g, '');
    
    // Check for range (e.g., "50000 - 80000" or "50000-80000")
    const rangeMatch = cleanSalary.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1]),
        max: parseInt(rangeMatch[2])
      };
    }
    
    // Check for single number with + (e.g., "60000+")
    const plusMatch = cleanSalary.match(/(\d+)\+/);
    if (plusMatch) {
      return { min: parseInt(plusMatch[1]) };
    }
    
    // Check for single number
    const singleMatch = cleanSalary.match(/(\d+)/);
    if (singleMatch) {
      return { min: parseInt(singleMatch[1]) };
    }
    
    return null;
  }
}
