import { PipeTransform, BadRequestException } from '@nestjs/common';

export class DateValidationPipe implements PipeTransform {
  transform(value: any) {
    if (/([0-9]{4})-([0-1]{1})([0-9]{1})-([0-9]){2}/.test(value)) {
      return value;
    } else {
      throw new BadRequestException(
        `date: '${value}' is in wrong format it should be YYYY-MM-DD`,
      );
    }
  }
}
