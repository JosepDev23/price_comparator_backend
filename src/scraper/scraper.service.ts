import { Injectable } from '@nestjs/common';
import Product from 'src/products/product.schema';
import { getAllMercadonaProducts } from './fetch/fetchMercadona';

@Injectable()
export class ScraperService {
    constructor() {}

    getMercadonaProducts(): Promise<Product[]> {
        return getAllMercadonaProducts();
    }
}
