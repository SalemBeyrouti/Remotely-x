import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Seniority, SenioritySchema } from './seniority.schema';
import { SeniorityService } from './seniority.service';
import { SeniorityAnalyticsController } from './seniority.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seniority.name, schema: SenioritySchema }]),
  ],
  controllers: [SeniorityAnalyticsController],
  providers: [SeniorityService],
  exports: [],
})
export class SeniorityModule {}
