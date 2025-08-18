import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salary, SalaryDocument } from './salaries.schema';
import { Job } from '../jobs/schemas/job.schema';

@Injectable()
export class SalariesService {
	constructor(
		@InjectModel(Salary.name) private readonly salaryModel: Model<SalaryDocument>,
	) {}

	async onJobCreated(job: Partial<Job>): Promise<void> {
		if (!job || !job.compensation_currency) return;
		const currency = job.compensation_currency;
		const doc = (await this.salaryModel.findOne({ currency })) || new this.salaryModel({ currency });

		let incremented = false;
		if (typeof job.compensation_min === 'number') {
			// update running average for min
			doc.avgMin = ((doc.avgMin || 0) * (doc.count || 0) + job.compensation_min) / ((doc.count || 0) + 1);
			incremented = true;
		}
		if (typeof job.compensation_max === 'number') {
			// update running average for max
			doc.avgMax = ((doc.avgMax || 0) * (doc.count || 0) + job.compensation_max) / ((doc.count || 0) + 1);
			incremented = true;
		}
		if (incremented) {
			doc.count = (doc.count || 0) + 1;
			await doc.save();
		}
	}

	async getAll(): Promise<Array<{ _id: string; avgMin: number; avgMax: number; count: number }>> {
		const docs = await this.salaryModel.find().lean();
		return docs.map(d => ({ _id: d.currency, avgMin: d.avgMin || 0, avgMax: d.avgMax || 0, count: d.count || 0 }));
	}
}
