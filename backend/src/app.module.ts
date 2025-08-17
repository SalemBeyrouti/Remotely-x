import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { MonthlyFrequencyModule } from './monthly-frequency/monthly-frequency.module';
import { SkillCorrelationModule } from './skill-correlation/skill-correlation.module';
import { SeniorityModule } from './seniority/seniority.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 
      'mongodb://admin:password123@localhost:27017/remotelyx?authSource=admin'
    ),
    JobsModule,
    MonthlyFrequencyModule,
    SkillCorrelationModule,
    SeniorityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
