import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalaryDocument = Salary & Document;

@Schema({ collection: 'salaries' })
export class Salary {
	@Prop({ required: true, unique: true })
	currency: string; // e.g., USD, EUR

	@Prop({ required: true, default: 0 })
	avgMin: number;

	@Prop({ required: true, default: 0 })
	avgMax: number;

	@Prop({ required: true, default: 0 })
	count: number;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
