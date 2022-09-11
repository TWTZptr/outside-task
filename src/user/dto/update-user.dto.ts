import { SigninDto } from '../../auth/dto/signin.dto';
import { PartialType } from '@nestjs/swagger/dist/type-helpers';

export class UpdateUserDto extends PartialType(SigninDto) {}
