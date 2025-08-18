import { Controller, Get } from '@nestjs/common';
import { SalariesService } from './salaries.service';

@Controller('jobs/analytics')
export class SalariesController {
	constructor(private readonly salariesService: SalariesService) {}

	@Get('salary')
	async getSalaries() {
		return this.salariesService.getAll();
	}
}
