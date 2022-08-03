import { MAX_TAG_NAME_LENGTH, MIN_TAG_NAME_LENGTH } from "../constants";
import { IsNotEmpty, IsNumberString, IsOptional, Length } from "class-validator";

export class CreateTagDto {
  @IsNotEmpty()
  @Length(MIN_TAG_NAME_LENGTH, MAX_TAG_NAME_LENGTH)
  name: string;

  @IsOptional()
  @IsNumberString()
  sortOrder?: number;
}
