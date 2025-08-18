import { Controller, Post, Body, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    // If skills are provided as a comma-separated string, convert to array
    if (createJobDto.skills && typeof createJobDto.skills === 'string') {
      const skillsString = createJobDto.skills as string;
      createJobDto.skills = skillsString
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }
    
    return this.jobsService.createJob(createJobDto);
  }

  @Post('bulk')
  async createBulkJobs(@Body() jobs: CreateJobDto[]) {
    return this.jobsService.createBulkJobs(jobs);
  }

  @Get()
  async getAllJobs(@Query() query: any) {
    return this.jobsService.getAllJobs(query);
  }

  @Get('search')
  async searchJobs(@Query('q') searchTerm: string) {
    return this.jobsService.searchJobs(searchTerm);
  }

  @Get('recent')
  async getRecentJobs(@Query('limit') limit: string) {
    return this.jobsService.getRecentJobs(parseInt(limit) || 10);
  }

  @Get('remote')
  async getRemoteJobs() {
    return this.jobsService.getRemoteJobs();
  }

  @Get('seniority/:level')
  async getJobsBySeniority(@Param('level') level: string) {
    return this.jobsService.getJobsBySeniority(level);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() body: any) {
    return this.jobsService.updateJob(id, body);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  // Analytics endpoints
  @Get('analytics/trends')
  async getMarketTrends() {
    return this.jobsService.getMarketTrends();
  }

  @Get('analytics/skills')
  async getSkillsAnalysis() {
    return this.jobsService.getSkillsAnalysis();
  }

  @Get('analytics/salary')
  async getSalaryAnalysis() {
    return this.jobsService.getSalaryAnalysis();
  }

  @Get('analytics/locations')
  async getLocationAnalysis() {
    return this.jobsService.getLocationAnalysis();
  }

  @Get('analytics/seniority')
  async getSeniorityAnalysis() {
    return this.jobsService.getSeniorityAnalysis();
  }
}
