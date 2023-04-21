import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post()
  @ApiOperation({ summary: 'Populate database' })
  @ApiResponse({ status: 201 })
  async populateDatabase(): Promise<void> {
    return this.scraperService.getMercadonaProducts();
  }
}
