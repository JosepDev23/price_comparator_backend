import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type Supermarket = 'consum' | 'mercadona';

export type ProductDocument = Product & Document;

@Schema()
export default class Product {

  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  price: number;

  @Prop()
  @ApiProperty()
  img: string;

  @Prop()
  @ApiProperty()
  supermarket: Supermarket;
}

export const ProductSchema = SchemaFactory.createForClass(Product);