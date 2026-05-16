import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
