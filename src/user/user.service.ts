import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepository: typeof User) {
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  findOne(uid: string): Promise<User> {
    return this.userRepository.findByPk(uid);
  }

  update(uid: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, { where: { uid } });
  }

  remove(uid: string) {
    return this.userRepository.destroy({ where: { uid } });
  }
}
