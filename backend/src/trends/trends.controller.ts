import { Controller, Get } from '@nestjs/common';
import { TrendsService } from './trends.service';

@Controller('jobs/analytics')
export class TrendsController {
	constructor(private readonly trendsService: TrendsService) {}

	@Get('trends')
	async getTrends() {
		return this.trendsService.getTrends();
	}
}
