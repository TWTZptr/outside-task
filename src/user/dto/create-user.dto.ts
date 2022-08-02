import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import {
  MAX_USER_EMAIL_LENGTH, MAX_USER_NICKNAME_LENGTH,
  MAX_USER_PASSWORD_LENGTH,
  MIN_USER_EMAIL_LENGTH, MIN_USER_NICKNAME_LENGTH,
  MIN_USER_PASSWORD_LENGTH,
} from '../constants';
import { IsSecurePassword } from '../../customValidators/IsSecurePassword/IsSecurePassword';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(MIN_USER_EMAIL_LENGTH, MAX_USER_EMAIL_LENGTH)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
  @Validate(IsSecurePassword)
  password: string;

  @IsNotEmpty()
  @Length(MIN_USER_NICKNAME_LENGTH, MAX_USER_NICKNAME_LENGTH)
  nickname: string;
}
