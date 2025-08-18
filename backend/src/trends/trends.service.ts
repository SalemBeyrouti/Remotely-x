import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trends, TrendsDocument } from './trends.schema';
import { Job } from '../jobs/schemas/job.schema';

@Injectable()
export class TrendsService {
	private readonly KEY = 'GLOBAL';

	constructor(
		@InjectModel(Trends.name) private readonly trendsModel: Model<TrendsDocument>,
		@InjectModel(Job.name) private readonly jobModel: Model<Job>,
	) {}

	async getTrends(): Promise<{
		totalJobs: number;
		remotePercentage: number;
		remoteJobs: number;
		averageSalary: number;
		seniorityDistribution: Array<{ _id: string; count: number }>;
		employmentTypeDistribution: Array<{ _id: string; count: number }>;
	}> {
		const doc = await this.trendsModel.findOne({ key: this.KEY }).lean();
		return {
			totalJobs: doc?.totalJobs ?? 0,
			remotePercentage: doc?.remotePercentage ?? 0,
			remoteJobs: doc?.remoteJobs ?? 0,
			averageSalary: doc?.averageSalary ?? 0,
			seniorityDistribution: Object.entries(doc?.seniorityCounts ?? {}).map(([k, v]) => ({ _id: k, count: v as number })),
			employmentTypeDistribution: Object.entries(doc?.employmentTypeCounts ?? {}).map(([k, v]) => ({ _id: k, count: v as number })),
		};
	}

	// Recompute derived fields after updates
	private computeDerived(doc: TrendsDocument | Trends): void {
		doc.remotePercentage = doc.totalJobs > 0 ? (doc.remoteJobs / doc.totalJobs) * 100 : 0;
		doc.averageSalary = doc.salaryCount > 0 ? doc.salarySum / doc.salaryCount : 0;
	}

	async onJobCreated(job: Partial<Job>): Promise<void> {
		const doc = (await this.trendsModel.findOne({ key: this.KEY })) || new this.trendsModel({ key: this.KEY });

		doc.totalJobs = (doc.totalJobs || 0) + 1;
		if (job.remote === true) {
			doc.remoteJobs = (doc.remoteJobs || 0) + 1;
		}
		if (typeof job.compensation_min === 'number') {
			doc.salarySum = (doc.salarySum || 0) + job.compensation_min;
			doc.salaryCount = (doc.salaryCount || 0) + 1;
		}
		if (job.seniority_level) {
			doc.seniorityCounts = doc.seniorityCounts || {} as any;
			doc.seniorityCounts[job.seniority_level] = (doc.seniorityCounts[job.seniority_level] || 0) + 1;
		}
		if (job.employment_type) {
			doc.employmentTypeCounts = doc.employmentTypeCounts || {} as any;
			doc.employmentTypeCounts[job.employment_type] = (doc.employmentTypeCounts[job.employment_type] || 0) + 1;
		}

		this.computeDerived(doc);
		await doc.save();
	}
}
