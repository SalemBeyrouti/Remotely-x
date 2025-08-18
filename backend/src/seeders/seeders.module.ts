import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { MonthlyFrequency, MonthlyFrequencySchema } from '../monthly-frequency/monthly-frequency.schema';
import { SkillCorrelation, SkillCorrelationSchema } from '../skill-correlation/skill-correlation.schema';
import { Seniority, SenioritySchema } from '../seniority/seniority.schema';
import { JobsSeeder } from './jobs.seeder';
import { MonthlyFrequencySeeder } from './monthly-frequency.seeder';
import { SkillCorrelationSeeder } from './skill-correlation.seeder';
import { SenioritySeeder } from './seniority.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: MonthlyFrequency.name, schema: MonthlyFrequencySchema },
      { name: SkillCorrelation.name, schema: SkillCorrelationSchema },
      { name: Seniority.name, schema: SenioritySchema },
    ]),
  ],
  providers: [
    JobsSeeder,
    MonthlyFrequencySeeder,
    SkillCorrelationSeeder,
    SenioritySeeder,
    SeederService,
  ],
  exports: [SeederService],
})
export class SeedersModule {}
