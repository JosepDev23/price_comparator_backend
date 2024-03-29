import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import Product from './product.schema'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DeleteResultDto } from 'src/delete-result-dto'

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products list', type: [Product] })
  @ApiQuery({
    name: 'supermarket',
    required: false,
    type: String,
    description: 'Supermarket name for filtering',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Product name for filtering',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Products limit by page',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Initial index for pagination',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Price order (asc or desc)',
  })
  async getProducts(
    @Query('supermarket') supermarket?: string,
    @Query('name') name?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('order') order?: string,
  ): Promise<Product[]> {
    return this.productService.findAll(supermarket, name, limit, offset, order)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  async postProduct(@Body() product: Product): Promise<Product> {
    return this.productService.save(product)
  }

  @Delete()
  @ApiOperation({ summary: 'Deletes all products' })
  @ApiResponse({
    status: 200,
    description: 'Number of deleted products',
    type: DeleteResultDto,
  })
  async deleteAllProducts(): Promise<{ deletedCount?: number }> {
    return this.productService.deleteAll()
  }
}
