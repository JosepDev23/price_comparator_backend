import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Product from 'src/products/product.schema';
import { ProductService } from 'src/products/product.service';

import { getAllMercadonaProducts } from './fetch/fetchMercadona';

@Injectable()
export class ScraperService {
    constructor(private readonly productService: ProductService) { }

    async getMercadonaProducts(): Promise<void> {
        const products: Product[] = await getAllMercadonaProducts();
        products.forEach(product => {
            this.productService.save(product)
        })
    }
}
