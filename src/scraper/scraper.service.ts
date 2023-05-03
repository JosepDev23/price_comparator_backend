import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Product from 'src/products/product.schema';
import axios from 'axios';
import { ProductService } from 'src/products/product.service';
import { Category, CategoryResponse, Result, CategoryData, ProductDataMercadona } from './interfaces/mercadona'
import { ConsumCategory, ConsumCategoryProductList, ID, ProductDataConsum } from './interfaces/consum';

@Injectable()
export class ScraperService {
    constructor(private readonly productService: ProductService) { }

    async getMercadonaProducts(): Promise<void> {
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
            return axios.get(`https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`);
        });

        const categories: CategoryData[] = await Promise.all(categoriesPromise);

        // Fill the array with products
        categories.forEach((data: CategoryData) => {
            data.categories?.forEach((subCategory: CategoryData) => {
                subCategory.products?.forEach((productData: ProductDataMercadona) => {
                    const product = new Product();
                        product.name = productData.display_name;
                        product.price = productData.price_instructions.unit_price;
                        product.img = productData.thumbnail,
                        product.description = "";
                    mercadonaProductList.push(product);
                });
            });
        });

        mercadonaProductList.forEach(product => {
            this.productService.save(product)
        })
    }

    async postConsumProducts(): Promise<void> {
        const consumCategoryList: ConsumCategory[] = [];
        let consumProductList: ProductDataConsum[] = [];

        const categoriesData: ConsumCategory[] = (await axios.get('https://tienda.consum.es/api/rest/V1.0/shopping/category/menu')).data;
        categoriesData.forEach(category => {
            fillCategoryList(category);
        });

        function fillCategoryList(category: ConsumCategory): void {
            if (category.subcategories.length !== 0) {
                category.subcategories.forEach(subCategory => {
                    fillCategoryList(subCategory);
                })
            } else {
                consumCategoryList.push({ id: category.id, nombre: category.nombre, subcategories: [] });
            }
        }

        async function getAllProducts(productList: ConsumCategoryProductList, count: number, categoryId: number): Promise<void> {
            if (!productList.hasMore) return;
            consumProductList = [...consumProductList, ...productList.products];
            count = count + 100;
            const pageData: ConsumCategoryProductList = (await axios.get(`https://tienda.consum.es/api/rest/V1.0/catalog/product?categories=${categoryId}&offset=${count}&limit=100`)).data
            await getAllProducts(pageData, count, categoryId);
        }

        for (const category of consumCategoryList) {
            const productList: ConsumCategoryProductList = (await axios.get(`https://tienda.consum.es/api/rest/V1.0/catalog/product?categories=${category.id}&offset=${0}&limit=100`)).data
            await getAllProducts(productList, 100, category.id);
        };

        for (const productData of consumProductList) {
            const product = new Product();
                product.name = productData.productData.name;
                product.description = productData.productData.description;
                product.img = productData.productData?.imageURL ?? productData.media[0]?.url;
                product.price = productData.priceData.prices.find(price => price.id === ID.Price).value.centAmount;
            this.productService.save(product);
        }
    }
}
