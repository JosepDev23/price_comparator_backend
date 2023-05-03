import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import Product from './product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) { }

  async save(product: Product): Promise<Product> {
    const savedProduct = new this.productModel(product);
    return savedProduct.save();
  }

  async findAll(name: string, limit: number, offset: number, priceOrder: string): Promise<Product[]> {
    const filter = { name: new RegExp(name, 'i') };
    const sortPriceOrder = priceOrder === 'desc' ? -1 : 1;
    return this.productModel.find(filter).sort({ price: sortPriceOrder }).limit(limit).skip(offset).exec();
  }

  async deleteAll(): Promise<{ deletedCount?: number }> {
    return this.productModel.deleteMany().exec();
  }

}
