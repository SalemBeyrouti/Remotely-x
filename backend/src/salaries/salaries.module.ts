import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Salary, SalarySchema } from './salaries.schema';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';

@Module({
	imports: [MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }])],
	providers: [SalariesService],
	controllers: [SalariesController],
	exports: [SalariesService],
})
export class SalariesModule {}
