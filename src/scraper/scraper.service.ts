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
import { Injectable } from '@nestjs/common'

@Injectable()
export class ScraperService {
  constructor(private readonly productService: ProductService) {}

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

    for (let i = 0; i < mercadonaCategoryList.length; i++) {
      // Timeout to avoid 429
      setTimeout(async () => {
        // Retrieve category list
        const category = mercadonaCategoryList[i]
        let data = (
          await axios.get(
            `https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`,
          )
        ).data as CategoryData
        // Iterate over categories to save products
        data.categories?.forEach((subCategory: CategoryData) => {
          subCategory.products?.forEach((productData: ProductDataMercadona) => {
            const product = new Product()
            product.name = productData.display_name
            product.price = productData.price_instructions.unit_price
            product.img = productData.thumbnail
            product.description = ''
            product.supermarket = 'mercadona'
            mercadonaProductList.push(product)

            this.productService.save(product)
          })
        })
      }, i * 100)
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
