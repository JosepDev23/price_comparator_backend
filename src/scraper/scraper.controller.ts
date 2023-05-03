import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post('/mercadona')
  @ApiOperation({ summary: 'Populate database with Mercadona' })
  @ApiResponse({ status: 201 })
  async populateDatabase(): Promise<void> {
    return this.scraperService.postMercadonaProducts();
  }
}
