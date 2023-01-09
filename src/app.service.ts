import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async getPictures(startDate, endDate): Promise<any> {
    this.logger.log(
      `Request started ${process.env.URL_NASA_APOD + process.env.API_KEY}`,
    );
    this.logger.log(
      `${
        process.env.URL_NASA_APOD + process.env.API_KEY
      }&start_date=${startDate}&end_date=${endDate}`,
    );
    return await axios
      .get(
        `${
          process.env.URL_NASA_APOD + process.env.API_KEY
        }&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        return res.data;
      });
  }
}
