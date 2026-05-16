import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title!: string;

  @Prop()
  content!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  sharedWith!: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
