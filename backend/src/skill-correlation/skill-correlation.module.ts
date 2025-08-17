import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillCorrelation, SkillCorrelationSchema } from './skill-correlation.schema';
import { SkillCorrelationService } from './skill-correlation.service';
import { SkillCorrelationController } from './skill-correlation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SkillCorrelation.name, schema: SkillCorrelationSchema }]),
  ],
  controllers: [SkillCorrelationController],
  providers: [SkillCorrelationService],
  exports: [],
})
export class SkillCorrelationModule {}
