import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobsSeeder } from './jobs.seeder';
import { MonthlyFrequencySeeder } from './monthly-frequency.seeder';
import { SkillCorrelationSeeder } from './skill-correlation.seeder';
import { SenioritySeeder } from './seniority.seeder';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly jobsSeeder: JobsSeeder,
    private readonly monthlyFrequencySeeder: MonthlyFrequencySeeder,
    private readonly skillCorrelationSeeder: SkillCorrelationSeeder,
    private readonly senioritySeeder: SenioritySeeder,
  ) {}

  async onModuleInit() {
    // Wait a bit for MongoDB to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.seed();
  }

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Seed in order to maintain referential integrity
      await this.jobsSeeder.seed();
      await this.monthlyFrequencySeeder.seed();
      await this.skillCorrelationSeeder.seed();
      await this.senioritySeeder.seed();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
    }
  }

  async clear(): Promise<void> {
    console.log('🗑️ Clearing all seeded data...');
    
    try {
      await this.jobsSeeder.clear();
      await this.monthlyFrequencySeeder.clear();
      await this.skillCorrelationSeeder.clear();
      await this.senioritySeeder.clear();
      
      console.log('✅ Database cleared successfully!');
    } catch (error) {
      console.error('❌ Database clearing failed:', error);
    }
  }
}
