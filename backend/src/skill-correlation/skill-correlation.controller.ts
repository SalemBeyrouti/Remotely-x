import { Controller, Get } from '@nestjs/common';
import { SkillCorrelationService } from './skill-correlation.service';

@Controller('skill-correlation')
export class SkillCorrelationController {
  constructor(private readonly skillCorrelationService: SkillCorrelationService) {}

  @Get()
  async getAllCorrelations() {
    return this.skillCorrelationService.getAllCorrelations();
  }
}
