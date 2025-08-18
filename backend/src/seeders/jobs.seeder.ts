import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../jobs/schemas/job.schema';

@Injectable()
export class JobsSeeder {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.jobModel.countDocuments();
    if (count > 0) {
      console.log('Jobs already seeded, skipping...');
      return;
    }

    const sampleJobs = [
      {
        job_title: 'Senior Full Stack Developer',
        seniority_level: 'Senior',
        employment_type: 'Full-time',
        remote: true,
        schedule_hours_local: '9 AM - 5 PM',
        work_days: 'Monday - Friday',
        days_off: 'Weekends + Holidays',
        compensation_currency: 'USD',
        compensation_min: 80000,
        compensation_max: 120000,
        compensation_notes: 'Competitive salary with benefits',
        role_overview: 'We are looking for a Senior Full Stack Developer to join our team.',
        responsibilities: 'Develop and maintain web applications, collaborate with team members, mentor junior developers',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
        benefits: 'Health insurance, 401k, flexible PTO, remote work options'
      },
      {
        job_title: 'Frontend Developer',
        seniority_level: 'Mid-level',
        employment_type: 'Full-time',
        remote: true,
        schedule_hours_local: '9 AM - 6 PM',
        work_days: 'Monday - Friday',
        days_off: 'Weekends + Holidays',
        compensation_currency: 'USD',
        compensation_min: 60000,
        compensation_max: 90000,
        compensation_notes: 'Market rate with performance bonuses',
        role_overview: 'Join our frontend team to build amazing user experiences.',
        responsibilities: 'Build responsive web interfaces, optimize performance, collaborate with designers',
        skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
        benefits: 'Health insurance, dental, vision, gym membership'
      },
      {
        job_title: 'Backend Developer',
        seniority_level: 'Junior',
        employment_type: 'Full-time',
        remote: false,
        schedule_hours_local: '8 AM - 4 PM',
        work_days: 'Monday - Friday',
        days_off: 'Weekends + Holidays',
        compensation_currency: 'USD',
        compensation_min: 45000,
        compensation_max: 65000,
        compensation_notes: 'Entry-level position with growth potential',
        role_overview: 'Start your career as a Backend Developer with our growing team.',
        responsibilities: 'Develop APIs, work with databases, learn from senior developers',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Git'],
        benefits: 'Health insurance, learning budget, mentorship program'
      }
    ];

    await this.jobModel.insertMany(sampleJobs);
    console.log(`Seeded ${sampleJobs.length} jobs`);
  }

  async clear(): Promise<void> {
    await this.jobModel.deleteMany({});
    console.log('Cleared all jobs');
  }
}
