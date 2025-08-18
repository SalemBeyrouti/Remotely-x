import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillCount, SkillCountSchema } from './skill-count.schema';
import { SkillCountService } from './skill-count.service';
import { SkillCountController } from './skill-count.controller';

@Module({
	imports: [MongooseModule.forFeature([{ name: SkillCount.name, schema: SkillCountSchema }])],
	providers: [SkillCountService],
	controllers: [SkillCountController],
	exports: [SkillCountService],
})
export class SkillCountModule {}
