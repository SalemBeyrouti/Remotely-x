import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Job extends Document {
  @Prop({ required: true })
  job_title: string;

  @Prop()
  seniority_level: string;

  @Prop()
  employment_type: string;

  @Prop()
  remote: boolean;

  @Prop()
  schedule_hours_local: string;

  @Prop()
  work_days: string;

  @Prop()
  days_off: string;

  @Prop()
  compensation_currency: string;

  @Prop()
  compensation_min: number;

  @Prop()
  compensation_max: number;

  @Prop()
  compensation_notes: string;

  @Prop()
  role_overview: string;

  @Prop()
  responsibilities: string;

  @Prop({ type: [String] })
  requirements: string[];

  @Prop()
  benefits: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
