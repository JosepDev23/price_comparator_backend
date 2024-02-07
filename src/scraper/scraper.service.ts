import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import Product from 'src/products/product.schema'
import axios, { AxiosError } from 'axios'
import { ProductService } from 'src/products/product.service'
import {
  Category,
  CategoryResponse,
  Result,
  CategoryData,
  ProductDataMercadona,
} from './interfaces/mercadona'
import {
  ConsumCategory,
  ConsumCategoryProductList,
  ID,
  ProductDataConsum,
} from './interfaces/consum'
import { SemanticService } from 'src/semantic/semantic.service'

@Injectable()
export class ScraperService {
  constructor(
    private readonly productService: ProductService,
    private readonly semanticService: SemanticService,
  ) {}

  async postMercadonaProducts(): Promise<void> {
    const mercadonaCategoryList: Category[] = []
    const mercadonaProductList: Product[] = []

    // Get the full list of categories
    const categoriesJSON: CategoryResponse = (
      await axios.get('https://tienda.mercadona.es/api/categories/')
    ).data

    categoriesJSON.results.forEach((upperCategory: Result) => {
      upperCategory.categories?.forEach((lowerCategory: Result) => {
        const category: Category = {
          id: lowerCategory.id,
          name: lowerCategory.name,
        }
        mercadonaCategoryList.push(category)
      })
    })

    // Get All the info about all categories
    const categoriesPromise: Promise<CategoryData>[] =
      mercadonaCategoryList.map(async (category: Category) => {
        return (
          await axios.get(
            `https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`,
          )
        ).data
      })

    const categories: CategoryData[] = await Promise.all(categoriesPromise)

    // Fill the array with products
    categories.forEach((data: CategoryData) => {
      data.categories?.forEach((subCategory: CategoryData) => {
        subCategory.products?.forEach((productData: ProductDataMercadona) => {
          const product = new Product()
          product.name = productData.display_name
          product.price = productData.price_instructions.unit_price
          product.img = productData.thumbnail
          product.description = ''
          product.supermarket = 'mercadona'
          mercadonaProductList.push(product)
        })
      })
    })

    await Promise.all(
      mercadonaProductList.map(async (product) => {
        this.productService.save(this.semanticService.assignSemantic(product))
      }),
    )
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
        this.productService.save(this.semanticService.assignSemantic(product))
      }
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.message)
    }
  }
}
