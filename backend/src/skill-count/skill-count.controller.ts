import { Controller, Get } from '@nestjs/common';
import { SkillCountService } from './skill-count.service';

@Controller('jobs/analytics')
export class SkillCountController {
	constructor(private readonly skillCountService: SkillCountService) {}

	@Get('skills')
	async getSkills() {
		return this.skillCountService.getAll();
	}
}
