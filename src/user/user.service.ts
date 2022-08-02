import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize/types/model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepository: typeof User) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    newUser.password = undefined;
    return newUser;
  }

  findOneByUid(uid: string): Promise<User> {
    return this.userRepository.findByPk(uid);
  }

  update(uid: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, { where: { uid } });
  }

  remove(uid: string) {
    return this.userRepository.destroy({ where: { uid } });
  }

  async findOne(options: FindOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }
}
