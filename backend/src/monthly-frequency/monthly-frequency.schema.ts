import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MonthlyFrequencyDocument = MonthlyFrequency & Document;

@Schema({ collection: 'monthly-frequency' })
export class MonthlyFrequency {
  @Prop({ required: true, unique: true })
  name: string; // Skill name or 'Total Jobs'

  @Prop({
    type: Map,
    of: Number,
    default: {},
    required: true,
    description: 'Key is YYYY-MM, value is count for that month',
  })
  monthlyCounts: Record<string, number>;
}

export const MonthlyFrequencySchema = SchemaFactory.createForClass(MonthlyFrequency);
