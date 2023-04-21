import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ProductService } from 'src/products/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import Product, { ProductSchema } from 'src/products/product.schema';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([{
            name: Product.name,
            schema: ProductSchema
          }])
    ],
    providers: [ScraperService],
    controllers: [ScraperController]
})
export class ScraperModule { }
