import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize/types/model';
import { UNEXIST_USER_MSG } from './constants';
import { Op } from 'sequelize';
import {
  NOT_UNIQUE_EMAIL_MSG,
  NOT_UNIQUE_NICKNAME_MSG,
} from '../auth/constants';
import { PasswordService } from '../password/password.service';
import { SigninDto } from '../auth/dto/signin.dto';
import { UserTagService } from 'src/userTag/user-tag.service';
import { PublicTagInfoDto } from '../tag/dto/public-tag-info.dto';
import { mapTagToPublicTagInfo } from 'src/helpers/TagToPublicTagInfoDtoMapper';
import { UserWithPublicTagsDto } from './dto/user-with-public-tags.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly passwordService: PasswordService,
    private readonly userTagService: UserTagService,
  ) {}

  async create(createUserDto: SigninDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    newUser.password = undefined;
    return newUser;
  }

  findOneByUidWithPassword(uid: string): Promise<User> {
    return this.userRepository.findByPk(uid);
  }

  async findOneByUid(uid: string, excludeFields: string[] = []): Promise<User> {
    const user = await this.userRepository.findByPk(uid, {
      attributes: { exclude: ['password', ...excludeFields] },
      include: { all: true },
    });
    if (!user) {
      throw new NotFoundException(UNEXIST_USER_MSG);
    }
    return user;
  }

  async getUserWithTags(userUid: string): Promise<UserWithPublicTagsDto> {
    const user = await this.userRepository.findByPk(userUid, {
      attributes: { exclude: ['password', 'uid'] },
      include: ['tags'],
    });

    if (!user) {
      throw new NotFoundException(UNEXIST_USER_MSG);
    }

    const tags = mapTagToPublicTagInfo(user.tags);

    return { email: user.email, nickname: user.nickname, tags };
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
      const user = await this.userRepository.findOne({
        where: { [Op.or]: conditions },
      });
      if (user && updateUserDto.email === updateUserDto.email) {
        throw new ConflictException(NOT_UNIQUE_EMAIL_MSG);
      }

      if (user && updateUserDto.nickname === updateUserDto.nickname) {
        throw new ConflictException(NOT_UNIQUE_NICKNAME_MSG);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hash(
        updateUserDto.password,
      );
    }

    await userToUpdate.update(updateUserDto);
    return this.findOne({
      where: { uid: userToUpdate.uid },
      attributes: { exclude: ['password', 'uid'] },
    });
  }

  async tryRemoveUser(uid: string): Promise<User> {
    const user = await this.findOneByUid(uid);
    if (!user) {
      throw new BadRequestException(UNEXIST_USER_MSG);
    }

    await user.destroy();
    return user;
  }

  async findOne(options: FindOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }

  async tryRemoveUserAndHisTags(uid: string): Promise<void> {
    const user = await this.tryRemoveUser(uid);
    await this.removeUserTagsByUser(user);
  }

  async removeUserTagsByUser(user: User): Promise<void> {
    const tagRemovePromises: Promise<void>[] = [];
    const userTags = await user.$get('createdTags');
    userTags.forEach((tag) => tagRemovePromises.push(tag.destroy()));
    await Promise.all(tagRemovePromises);
  }

  async tryToAddTagsToUser(
    userUid: string,
    tagIds: number[],
  ): Promise<{ id: number; name: string; sortOrder: number }[]> {
    await this.userTagService.addTagsToUser(userUid, tagIds);
    const user = await this.findOneByUid(userUid);
    const tags = await user.$get('tags');

    return mapTagToPublicTagInfo(tags);
  }

  async deleteTagFromUser(userUid: string, tagId: number): Promise<void> {
    return this.userTagService.deleteTagFromUserIfExist(userUid, tagId);
  }

  async getUserTags(userUid: string): Promise<PublicTagInfoDto[]> {
    const user = await this.findOneByUid(userUid);
    const tags = await user.$get('tags', {});
    return mapTagToPublicTagInfo(tags);
  }
}
