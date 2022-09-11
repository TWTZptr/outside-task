import { MAX_TAG_NAME_LENGTH, MIN_TAG_NAME_LENGTH } from '../constants';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class CreateTagDto {
  @ApiProperty({
    example: 'tagname',
    description: 'Название тэга',
  })
  @IsNotEmpty()
  @Length(MIN_TAG_NAME_LENGTH, MAX_TAG_NAME_LENGTH)
  name: string;

  @ApiProperty({
    example: '3',
    description: 'Порядок сортировки',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  sortOrder?: number;
}
