import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeniorityDocument = Seniority & Document;

@Schema({ collection: 'seniority' })
export class Seniority {
  @Prop({ required: true, unique: true })
  level: string; // Seniority level or 'TOTAL_JOBS'

  @Prop({ required: true, default: 0 })
  count: number;
}

export const SenioritySchema = SchemaFactory.createForClass(Seniority);
