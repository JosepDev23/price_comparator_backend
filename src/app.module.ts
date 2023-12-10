import { Module } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductModule } from './products/product.module';
import { ScraperModule } from './scraper/scraper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI_DEV'),
      }),
      inject: [ConfigService],
    }),
    SwaggerModule,
    ProductModule,
    ScraperModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
})
export class AppModule { }
