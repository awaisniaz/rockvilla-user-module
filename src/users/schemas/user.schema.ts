// src/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../../seed/schemas/category.schema';
import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema()
export class User {
  @Prop({
    type: String,
    default: uuidv4, // Automatically generate a UUID for new documents
  })
  id: string;

  @Prop({ required: true, unique: true })
  readonly email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  dob?: string;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  })
  categories?: Category[];

  @Prop({ required: false })
  image?: string; // URL or file path for the image
}

export const UserSchema = SchemaFactory.createForClass(User);
