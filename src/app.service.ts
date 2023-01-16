import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async getPictures(startDate, endDate): Promise<object> {
    this.logger.log(
      `Request started ${process.env.URL_NASA_APOD + process.env.API_KEY}`,
    );
    this.logger.log(
      `${
        process.env.URL_NASA_APOD + process.env.API_KEY + process.env.API_KEY
          ? process.env.API_KEY
          : 'DEMO_KEY'
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
          timeout: 240000,
        },
      )
      .then((res) => {
        const filteredMediaType = res.data
          .filter(function (record) {
            return record.media_type === 'image';
          })
          .map(function (media) {
            return media.hdurl;
          });
        return { urls: filteredMediaType };
      });
  }
}
