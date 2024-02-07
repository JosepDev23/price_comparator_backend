import { Injectable } from '@nestjs/common'
import SemanticRegExp from './utils/semantic-reg-exp'
import Product from 'src/products/product.schema'
import SemanticEnum from './models/semantic.enum'

@Injectable()
export class SemanticService {
  constructor() {}

  assignSemantic(product: Product): Product {
    for (const semantic in SemanticRegExp) {
      product.semantic = []
      if (SemanticRegExp[semantic].test(product.name)) {
        product.semantic.push(semantic as SemanticEnum)
      }
    }
    return product
  }
}
