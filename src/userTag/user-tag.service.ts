import { Injectable, BadRequestException } from '@nestjs/common';
import { UserTag } from './user-tag.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  USER_ALREADY_HAS_TAG_MSG,
  ADD_UNEXIST_TAG_MSG,
} from 'src/user/constants';
import sequelize from 'sequelize';
import { USER_DOES_NOT_HAVE_TAG_MSG } from 'src/user/constants';

@Injectable()
export class UserTagService {
  constructor(
    @InjectModel(UserTag) private readonly userTagRepository: typeof UserTag,
  ) {}

  async addTagsToUser(userUid: string, tagIds: number[]): Promise<void> {
    const tagsToAdd = tagIds.map((tagId) => ({ tagId, userUid }));
    try {
      await this.userTagRepository.bulkCreate(tagsToAdd);
    } catch (err) {
      if (err instanceof sequelize.ValidationError) {
        throw new BadRequestException(USER_ALREADY_HAS_TAG_MSG);
      }

      if (err instanceof sequelize.ForeignKeyConstraintError) {
        throw new BadRequestException(ADD_UNEXIST_TAG_MSG);
      }

      throw err;
    }
  }

  async deleteTagFromUserIfExist(
    userUid: string,
    tagId: number,
  ): Promise<void> {
    const userTag = await this.userTagRepository.findOne({
      where: { userUid, tagId },
    });
    if (!userTag) {
      throw new BadRequestException(USER_DOES_NOT_HAVE_TAG_MSG);
    }

    await userTag.destroy();
  }
}
