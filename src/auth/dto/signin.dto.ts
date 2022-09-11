import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import {
  MAX_USER_EMAIL_LENGTH,
  MAX_USER_NICKNAME_LENGTH,
  MAX_USER_PASSWORD_LENGTH,
  MIN_USER_EMAIL_LENGTH,
  MIN_USER_NICKNAME_LENGTH,
  MIN_USER_PASSWORD_LENGTH,
} from '../../user/constants';
import { IsSecurePassword } from '../../customValidators/IsSecurePassword/IsSecurePassword';
import { ApiProperty } from '@nestjs/swagger/dist';

export class SigninDto {
  @ApiProperty({
    example: 'example@domain.com',
    description: 'Адрес электронной почты',
  })
  @IsNotEmpty()
  @Length(MIN_USER_EMAIL_LENGTH, MAX_USER_EMAIL_LENGTH)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPASSWORD222',
    description:
      'Пароль, должен содержать как минимум 1 число, одну большую и одну маленькую буквы и быть не менее 8 символов',
  })
  @IsNotEmpty()
  @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH)
  @Validate(IsSecurePassword)
  password: string;

  @ApiProperty({ example: 'supernickname', description: 'Никнейм' })
  @IsNotEmpty()
  @Length(MIN_USER_NICKNAME_LENGTH, MAX_USER_NICKNAME_LENGTH)
  nickname: string;
}
