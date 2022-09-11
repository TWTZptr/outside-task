import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformEmptyStringToTruePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const result = {};

    for (const key in value) {
      if (value[key] === '') {
        result[key] = true;
      } else {
        result[key] = value[key];
      }
    }

    return result;
  }
}
