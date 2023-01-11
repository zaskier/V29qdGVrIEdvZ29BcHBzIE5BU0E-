import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('pictures')
  getPictures(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<object> {
    return this.appService.getPictures(startDate, endDate);
  }
}
