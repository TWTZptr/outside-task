import { IsNumber, IsNumberString } from 'class-validator';

export class AddTagsToUserDto {
  @IsNumberString({}, { each: true })
  tags: number[];
}
