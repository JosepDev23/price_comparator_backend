import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import Product, { ProductSchema } from 'src/products/product.schema';
import { ScraperService } from './scraper.service';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [ScraperService]
})
export class ScraperModule {}
