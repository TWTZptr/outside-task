import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class LoginUserDto {
  @ApiProperty({
    example: 'example@domain.com',
    description: 'Адрес электронной почты',
  })
  email: string;

  @ApiProperty({
    example: 'strongPASSWORD222',
    description: 'Пароль',
  })
  password: string;
}
