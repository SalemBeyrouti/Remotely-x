import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlyFrequency, MonthlyFrequencySchema } from './monthly-frequency.schema';
import { MonthlyFrequencyService } from './monthly-frequency.service';
import { MonthlyFrequencyController } from './monthly-frequency.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MonthlyFrequency.name, schema: MonthlyFrequencySchema }]),
  ],
  controllers: [MonthlyFrequencyController],
  providers: [MonthlyFrequencyService],
  exports: [],
})
export class MonthlyFrequencyModule {}
