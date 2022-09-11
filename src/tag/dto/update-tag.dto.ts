import { CreateTagDto } from './create-tag.dto';
import { PartialType } from '@nestjs/swagger/dist/type-helpers';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
