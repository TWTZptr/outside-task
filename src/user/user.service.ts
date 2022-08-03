import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/sequelize";
import { FindOptions } from "sequelize/types/model";
import { UNEXIST_USER_MSG } from "./constants";
import { Op } from "sequelize";
import { NOT_UNIQUE_EMAIL_MSG, NOT_UNIQUE_NICKNAME_MSG } from "../auth/constants";
import { PasswordService } from "../password/password.service";
import { SigninDto } from "../auth/dto/signin.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepository: typeof User, private readonly passwordService: PasswordService) {
  }

  async create(createUserDto: SigninDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    newUser.password = undefined;
    return newUser;
  }

  findOneByUidWithPassword(uid: string): Promise<User> {
    return this.userRepository.findByPk(uid);
  }

  async findOneByUid(uid: string): Promise<User> {
    const user = await this.userRepository.findByPk(uid);
    if (!user) {
      throw new NotFoundException(UNEXIST_USER_MSG);
    }
    user.password = undefined;
    return user;
  }

  async update(uid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.findOneByUid(uid);

    if (!userToUpdate) {
      throw new NotFoundException(UNEXIST_USER_MSG);
    }

    const conditions = [];


    if (updateUserDto.email) {
      conditions.push({ email: updateUserDto.email });
    }

    if (updateUserDto.nickname) {
      conditions.push({ nickname: updateUserDto.nickname });
    }

    if (conditions.length) {
      const user = await this.userRepository.findOne({ where: { [Op.or]: conditions } });
      if (user && updateUserDto.email === updateUserDto.email) {
        throw new ConflictException(NOT_UNIQUE_EMAIL_MSG);
      }

      if (user && updateUserDto.nickname === updateUserDto.nickname) {
        throw new ConflictException(NOT_UNIQUE_NICKNAME_MSG);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hash(updateUserDto.password);
    }

    return userToUpdate.update(updateUserDto);
  }

  remove(uid: string) {
    return this.userRepository.destroy({ where: { uid } });
  }

  async findOne(options: FindOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }
}
