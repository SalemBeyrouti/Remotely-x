import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillCount, SkillCountDocument } from './skill-count.schema';
import { Job } from '../jobs/schemas/job.schema';

@Injectable()
export class SkillCountService {
	constructor(
		@InjectModel(SkillCount.name) private readonly skillCountModel: Model<SkillCountDocument>,
	) {}

	async getAll(): Promise<Array<{ _id: string; count: number }>> {
		const docs = await this.skillCountModel.find().lean();
		return docs.map(d => ({ _id: d.name, count: d.count }));
	}

	async onJobCreated(job: Partial<Job>): Promise<void> {
		const skills = (job as any)?.skills as string[] | undefined;
		if (!skills || skills.length === 0) return;
		// dedupe skills within one job
		const unique = Array.from(new Set(skills));
		await Promise.all(unique.map(async (s) => {
			await this.skillCountModel.updateOne(
				{ name: s },
				{ $inc: { count: 1 } },
				{ upsert: true },
			);
		}));
	}
}
