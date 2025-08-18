import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeederService } from './src/seeders/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);
  
  console.log('🌱 Starting manual database seeding...');
  
  try {
    await seederService.seed();
    console.log('✅ Manual seeding completed successfully!');
  } catch (error) {
    console.error('❌ Manual seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
