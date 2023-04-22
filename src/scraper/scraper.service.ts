import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Product from 'src/products/product.schema';
import axios from 'axios';
import { ProductService } from 'src/products/product.service';
import { Category, CategoryResponse, Result, CategoryData, ProductData, PriceInstructions } from './interfaces/mercadona'

@Injectable()
export class ScraperService {
    constructor(private readonly productService: ProductService) { }

    async postMercadonaProducts(): Promise<void> {
        const mercadonaCategoryList: Category[] = [];
        const mercadonaProductList: Product[] = [];

        // Get the full list of categories
        const categoriesJSON: CategoryResponse = (await axios.get('https://tienda.mercadona.es/api/categories/')).data;

        categoriesJSON.results.forEach((upperCategory: Result) => {
            upperCategory.categories?.forEach((lowerCategory: Result) => {
                const category: Category = { id: lowerCategory.id, name: lowerCategory.name }
                mercadonaCategoryList.push(category);
            });
        });

        // Get All the info about all categories
        const categoriesPromise: Array<Promise<CategoryData>> = mercadonaCategoryList.map(async (category: Category) => {
            return (await axios.get(`https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`)).data;
        });

        const categories: CategoryData[] = await Promise.all(categoriesPromise);

        // Fill the array with products
        categories.forEach((data: CategoryData) => {
            data.categories?.forEach((subCategory: CategoryData) => {
                subCategory.products?.forEach((productData: ProductData) => {
                    const product = new Product();
                    product.name = productData.display_name;
                    product.price = productData.price_instructions.unit_price;
                    product.img = productData.thumbnail;
                    product.description = "";
                    mercadonaProductList.push(product);
                });
            });
        });

        await Promise.all(mercadonaProductList.map(async (product) => {
            this.productService.save(product)
        }))
    }
}
