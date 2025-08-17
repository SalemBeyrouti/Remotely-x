import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) {}

  async createJob(data: Partial<Job>): Promise<Job> {
    const createdJob = new this.jobModel(data);
    return createdJob.save();
  }
}
