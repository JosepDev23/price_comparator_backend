import { ApiProperty } from "@nestjs/swagger";

export default class Product {

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  img: string;
}