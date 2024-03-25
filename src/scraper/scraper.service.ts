import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import Product from 'src/products/product.schema'
import axios, { AxiosError } from 'axios'
import { ProductService } from 'src/products/product.service'
import {
  CategoryMercadona,
  CategoryResponseMercadona,
  ResultMercadona,
  CategoryDataMercadona,
  ProductDataMercadona,
} from './interfaces/mercadona'
import {
  ConsumCategory,
  ConsumCategoryProductList,
  ID,
  ProductDataConsum,
} from './interfaces/consum'
import { CategoryService } from 'src/categories/category.service'
import { MercadonaCategoriesException } from './exceptions/mercadona-categories-exception'

@Injectable()
export class ScraperService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async postMercadonaProducts(): Promise<void> {
    const mercadonaCategoryList: CategoryMercadona[] = []
    const mercadonaProductList: Product[] = []

    const categoriesJSON: CategoryResponseMercadona =
      await this.getMercadonaCategories()

    categoriesJSON.results.forEach((upperCategory: ResultMercadona) => {
      upperCategory.categories?.forEach((lowerCategory: ResultMercadona) => {
        const category: CategoryMercadona = {
          id: lowerCategory.id,
          name: lowerCategory.name,
        }
        mercadonaCategoryList.push(category)
      })
    })

    for (let i = 0; i < mercadonaCategoryList.length; i++) {
      // Timeout to avoid 429
      setTimeout(async () => {
        // Retrieve category list
        const category = mercadonaCategoryList[i]
        let data = (
          await axios.get(
            `https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`,
          )
        ).data as CategoryDataMercadona
        // Iterate over categories to save products
        data.categories?.forEach((subCategory: CategoryDataMercadona) => {
          subCategory.products?.forEach((productData: ProductDataMercadona) => {
            const product = new Product()
            product.name = productData.display_name
            product.price = productData.price_instructions.unit_price
            product.img = productData.thumbnail
            product.description = ''
            product.supermarket = 'mercadona'
            product.category = this.categoryService.mapFromMercadona(data.id)
            mercadonaProductList.push(product)

            this.productService.save(product)
          })
        })
      }, i * 100)
    }
  }

  private async getMercadonaCategories(): Promise<CategoryResponseMercadona> {
    try {
      const data = (
        await axios.get('https://tienda.mercadona.es/api/categories/')
      ).data
      return data
    } catch (error) {
      throw new MercadonaCategoriesException()
    }
  }

  async postConsumProducts(): Promise<void> {
    try {
      const consumProductList: ProductDataConsum[] = []
      const productList: ConsumCategoryProductList[] = []
      const consumCategoryList: ConsumCategory[] = (
        await axios.get(
          'https://tienda.consum.es/api/rest/V1.0/shopping/category/menu',
        )
      ).data

      for (const category of consumCategoryList) {
        let count = 0
        let promise: ConsumCategoryProductList = (
          await axios.get(
            `https://tienda.consum.es/api/rest/V1.0/catalog/product?categories=${category.id}&offset=${count}&limit=100`,
          )
        ).data
        productList.push(promise)

        while (promise.hasMore) {
          count += 100
          promise = (
            await axios.get(
              `https://tienda.consum.es/api/rest/V1.0/catalog/product?categories=${category.id}&offset=${count}&limit=100`,
            )
          ).data
          productList.push(promise)
        }
      }

      productList.forEach((list) => {
        list.products.forEach((product) => {
          consumProductList.push({
            id: product.id,
            media: product.media,
            priceData: product.priceData,
            productData: product.productData,
          })
        })
      })

      for (const productData of consumProductList) {
        const product = new Product()
        product.name = productData.productData.name
        product.description = productData.productData.description
        product.img =
          productData.productData?.imageURL ?? productData.media[0]?.url
        product.price = productData.priceData.prices.find(
          (price) => price.id === ID.Price,
        ).value.centAmount
        product.supermarket = 'consum'
        this.productService.save(product)
      }
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.message)
    }
  }
}
