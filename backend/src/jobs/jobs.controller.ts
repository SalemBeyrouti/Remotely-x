import { Controller, Post, Body, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() body: any) {
    // Fields to group under requirements
    const reqFields = [
      'requirements',
      'tools_automation',
      'tech_frontend',
      'tech_backend',
      'tech_databases',
      'cloud_devops',
      'ai_tools',
      'security_auth',
      'testing_tooling',
      'platforms_integrations',
    ];

    let requirements: string[] = [];
    for (const field of reqFields) {
      if (body[field]) {
        requirements = requirements.concat(
          body[field]
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
        );
        delete body[field];
      }
    }
    body.requirements = requirements;
    return this.jobsService.createJob(body);
  }

  @Post('bulk')
  async createBulkJobs(@Body() jobs: any[]) {
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

  // n8n Scraped Data endpoints - MUST come before :id route
  @Get('scraped')
  async getScrapedJobs(@Query() query: any) {
    return this.jobsService.getScrapedJobs(query);
  }

  @Get('scraped/recent')
  async getRecentScrapedJobs(@Query('limit') limit: string) {
    return this.jobsService.getRecentScrapedJobs(parseInt(limit) || 10);
  }

  @Get('scraped/successful')
  async getSuccessfulScrapedJobs() {
    return this.jobsService.getSuccessfulScrapedJobs();
  }

  @Get('scraped/failed')
  async getFailedScrapedJobs() {
    return this.jobsService.getFailedScrapedJobs();
  }

  @Get('scraped/sync')
  async syncScrapedJobsToMain() {
    return this.jobsService.syncScrapedJobsToMain();
  }

  @Get('scraped/:id')
  async getScrapedJobById(@Param('id') id: string) {
    return this.jobsService.getScrapedJobById(id);
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
