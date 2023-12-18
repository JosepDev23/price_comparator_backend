import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Document } from 'mongoose'
import SemanticEnum from 'src/semantic/interfaces/semantic.enum'

export type Supermarket = 'consum' | 'mercadona'

export type ProductDocument = Product & Document

@Schema()
export default class Product {
  @Prop()
  @ApiProperty()
  name: string

  @Prop()
  @ApiProperty()
  description: string

  @Prop()
  @ApiProperty()
  price: number

  @Prop()
  @ApiProperty()
  img: string

  @Prop()
  @ApiProperty()
  supermarket: Supermarket

  @Prop()
  @ApiPropertyOptional()
  semantic: SemanticEnum[]
}

export const ProductSchema = SchemaFactory.createForClass(Product)
