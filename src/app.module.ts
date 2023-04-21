import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductModule } from './products/product.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ScraperModule } from './scraper/scraper.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/price_comparator'),
    SwaggerModule,
    ProductModule,
    ScraperModule
  ]
})
export class AppModule { }
