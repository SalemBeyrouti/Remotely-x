import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrendsDocument = Trends & Document;

@Schema({ collection: 'trends' })
export class Trends {
	@Prop({ required: true, unique: true, default: 'GLOBAL' })
	key: string; // single document identifier

	@Prop({ required: true, default: 0 })
	totalJobs: number;

	@Prop({ required: true, default: 0 })
	remoteJobs: number;

	@Prop({ required: true, default: 0 })
	remotePercentage: number; // computed: (remoteJobs/totalJobs)*100

	@Prop({ required: true, default: 0 })
	averageSalary: number; // computed average of compensation_min

	@Prop({ required: true, default: 0 })
	salarySum: number; // running sum of compensation_min

	@Prop({ required: true, default: 0 })
	salaryCount: number; // running count of jobs with compensation_min

	@Prop({ type: Map, of: Number, default: {} })
	seniorityCounts: Record<string, number>;

	@Prop({ type: Map, of: Number, default: {} })
	employmentTypeCounts: Record<string, number>;
}

export const TrendsSchema = SchemaFactory.createForClass(Trends);
