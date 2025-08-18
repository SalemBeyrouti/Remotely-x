import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillCountDocument = SkillCount & Document;

@Schema({ collection: 'skill_count' })
export class SkillCount {
	@Prop({ required: true, unique: true })
	name: string; // Skill name

	@Prop({ required: true, default: 0 })
	count: number; // Number of mentions
}

export const SkillCountSchema = SchemaFactory.createForClass(SkillCount);
