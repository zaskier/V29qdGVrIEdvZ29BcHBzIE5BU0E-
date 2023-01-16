import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {} from 'dotenv/config';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('Test data from API', () => {
    beforeEach(() => {
      setTimeout(() => {
        console.log('Delayed for 4 second.');
      }, 4000);
    });

    test('Get successful result of the API call - 4 pictures urls', async () => {
      await appService
        .getPictures('2021-11-01', '2021-11-04')
        .then((r: any) => {
          expect(r.urls).toBeDefined();
          expect(r.urls.length).toBe(4);
          expect(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
              r.urls[0],
            ),
          ).toBe(true);
        })
        .catch((error) => {
          throw error;
        });
    });

    test('Get bad request result of the API call - start date after end date', async () => {
      await appService
        .getPictures('2022-12-04', '2022-11-01')
        .then(() => {
          fail(`Expected failure response`);
        })
        .catch((e) => {
          if (e.response) {
            expect(e.response.status).toBe(400);
            expect(e.response.data.msg).toBe(
              'start_date cannot be after end_date',
            );
          } else {
            throw e;
          }
        });
    });

    test('Get bad request result of the API call - wrong date format data', async () => {
      await appService
        .getPictures('02-02-2022', 'wrongDateFormat')
        .then(() => {
          fail(`Expected failure response`);
        })
        .catch((e) => {
          if (e.response) {
            expect(e.response.status).toBe(400);
            expect(e.response.data.msg).toContain('does not match format');
          } else {
            throw e;
          }
        });
    });
  });

  describe('Test API keys for nasa https://api.nasa.gov/planetary/', () => {
    const wrongApiKey = 'wrongApiKey';
    test('wrong APi key should return 403', async () => {
      await axios
        .get(
          `${process.env.URL_NASA_APOD}${wrongApiKey}&start_date=2022-11-01&end_date=2022-12-04`,
        )
        .then(() => {
          fail(`Expected failure response`);
        })
        .catch((e) => {
          if (e.response) {
            expect(
              e.response.data.error.message ===
                'An invalid api_key was supplied. Get one at https://api.nasa.gov:443',
            ).toBe(true);
            expect(e.response.status).toBe(403);
          } else {
            throw e;
          }
        });
    });

    test('demo API key', async () => {
      await axios
        .get(
          `${
            process.env.URL_NASA_APOD + process.env.DEMO_KEY
          }&start_date=2022-12-01&end_date=2022-12-04`,
        )
        .then((r: any) => {
          expect(r.status).toBe(200);
        })
        .catch((e) => {
          if (e.response.status === 429) {
            //exception for to many request which happen often on demo key
            expect(e.response.status).toBe(429);
          } else {
            expect(e.response.status).toBe(200);
          }
        });
    });
  });
});
