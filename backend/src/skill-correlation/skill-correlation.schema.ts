import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillCorrelationDocument = SkillCorrelation & Document;

@Schema({ collection: 'skill_correlation' })
export class SkillCorrelation {
  @Prop({ required: true })
  skillA: string;

  @Prop({ required: true })
  skillB: string;

  @Prop({ required: true, default: 0 })
  count: number;
}

export const SkillCorrelationSchema = SchemaFactory.createForClass(SkillCorrelation);
