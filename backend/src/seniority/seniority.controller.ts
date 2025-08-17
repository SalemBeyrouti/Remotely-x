import { Controller, Get } from '@nestjs/common';
import { SeniorityService } from './seniority.service';

@Controller('seniority')
export class SeniorityController {
  constructor(private readonly seniorityService: SeniorityService) {}

  @Get()
  async getAllSeniorityDistribution() {
    return this.seniorityService.getAllSeniorityDistribution();
  }
}
