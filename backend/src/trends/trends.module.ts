import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trends, TrendsSchema } from './trends.schema';
import { TrendsService } from './trends.service';
import { TrendsController } from './trends.controller';
import { Job, JobSchema } from '../jobs/schemas/job.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Trends.name, schema: TrendsSchema },
			{ name: Job.name, schema: JobSchema },
		]),
	],
	providers: [TrendsService],
	controllers: [TrendsController],
	exports: [TrendsService],
})
export class TrendsModule {}
