import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import Product from './product.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [Product] })
  async getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: Product })
  async postProduct(@Body() product: Product): Promise<Product> {
    return this.productService.save(product);
  }

  @Post('populate')
  @ApiOperation({ summary: 'Populate database' })
  @ApiResponse({ status: 201 })
  async populateDataBase(): Promise<void> {
    return this.scrappeoChido();
  }
  async scrappeoChido(): Promise<void> { }
}
