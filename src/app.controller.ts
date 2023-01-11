import {
  Controller,
  Get,
  Query,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DateValidationPipe } from './utils/pipes/validation-date.pipe';

@Controller()
export class AppController {
  logger: Logger;

  constructor(private readonly appService: AppService) {
    this.logger = new Logger();
  }

  @Get('pictures')
  getPictures(
    @Query('start_date', new DateValidationPipe()) startDate: string,
    @Query('end_date', new DateValidationPipe()) endDate: string,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        this.logger.error('end_date cannot happen before start_date ');
        reject(new ConflictException('start date comes after end date'));
      }

      this.appService
        .getPictures(startDate, endDate)
        .then((pictures) => {
          resolve(pictures);
        })
        .catch((error) => {
          this.logger.error(error);
          reject(new ConflictException({ message: error.message }));
        });
    });
  }
}
