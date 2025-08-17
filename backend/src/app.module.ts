import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://HsenKob:Xq2Dm4llUJAuNjn6@cluster0.pgevcj6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
