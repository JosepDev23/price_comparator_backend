import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ProductService } from 'src/products/product.service';
import Product, { ProductSchema } from 'src/products/product.schema';


@Module({
    imports: [
      HttpModule,
      MongooseModule.forFeature([{
          name: Product.name,
          schema: ProductSchema
        }])
    ],
    providers: [ScraperService, ProductService],
    controllers: [ScraperController]
})
export class ScraperModule { }
