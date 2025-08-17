import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { MonthlyFrequencyModule } from './monthly-frequency/monthly-frequency.module';
import { SkillCorrelationModule } from './skill-correlation/skill-correlation.module';
import { SeniorityModule } from './seniority/seniority.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://HsenKob:Xq2Dm4llUJAuNjn6@cluster0.pgevcj6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    JobsModule,
    MonthlyFrequencyModule,
    SkillCorrelationModule,
    SeniorityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
