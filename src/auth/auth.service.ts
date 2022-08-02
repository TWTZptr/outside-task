import { ConflictException, Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Op } from 'sequelize';
import { NOT_UNIQUE_EMAIL_MSG, NOT_UNIQUE_NICKNAME_MSG } from './constants';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly passwordService: PasswordService) {
  }

  async signIn(signInDto: SigninDto): Promise<User> {
    const existingUser = await this.userService.findOne({
      where: {
        [Op.or]: [{ nickname: signInDto.nickname }, { email: signInDto.email }],
      },
    });

    if (existingUser) {
      if (existingUser.email === signInDto.email) {
        throw new ConflictException(NOT_UNIQUE_EMAIL_MSG);
      } else {
        throw new ConflictException(NOT_UNIQUE_NICKNAME_MSG);
      }
    }

    const hashedPassword = await this.passwordService.hash(signInDto.password);

    return this.userService.create({ ...signInDto, password: hashedPassword });
  }
}
