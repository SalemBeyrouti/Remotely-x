import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() body: any) {
    // Fields to group under skills
    const skillFields = [
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

    let skills: string[] = [];
    for (const field of skillFields) {
      if (body[field]) {
        skills = skills.concat(
          body[field]
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
        );
        delete body[field];
      }
    }
    body.skills = skills;
    return this.jobsService.createJob(body);
  }
}
