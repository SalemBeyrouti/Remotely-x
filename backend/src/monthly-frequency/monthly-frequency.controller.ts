import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MonthlyFrequencyService } from './monthly-frequency.service';

@Controller('monthly-frequency')
export class MonthlyFrequencyController {
  constructor(private readonly monthlyFrequencyService: MonthlyFrequencyService) {}

  @Get(':skill')
  async getSkillStats(@Param('skill') skill: string) {
    return this.monthlyFrequencyService.getSkillStats(skill);
  }

  @Get()
  async getAllStats() {
    return this.monthlyFrequencyService.getAllStats();
  }

  @Post('increment')
  async increment(@Body() body: { skill: string; month: string }) {
    await this.monthlyFrequencyService.incrementSkill(body.skill, body.month);
    return { success: true };
  }

  @Post('increment-total')
  async incrementTotal(@Body() body: { month: string }) {
    await this.monthlyFrequencyService.incrementTotalJobs(body.month);
    return { success: true };
  }
}
