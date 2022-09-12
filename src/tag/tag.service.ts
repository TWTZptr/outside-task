import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './tag.model';
import { TagWithCreatorDto } from './dto/tag-with-creator.dto';
import {
  NOT_UNIQUE_TAG_NAME_MSG,
  UNEXIST_TAG_ID_MSG,
  USER_IS_NOT_OWNER_OF_TAG_MSG,
} from './constants';
import { FindOptions } from 'sequelize/types/model';
import { FindAllQuery } from './types/find-all-query.type';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private readonly tagRepository: typeof Tag) {}

  async create(createTagDto: CreateTagDto, creatorUID: string): Promise<Tag> {
    await this.isTagNameUniqueCheck(createTagDto.name);
    const newTag = await this.tagRepository.create({
      ...createTagDto,
      creator: creatorUID,
    });
    newTag.creator = undefined;
    return newTag;
  }

  async isTagNameUniqueCheck(name: string): Promise<void> {
    const tag = await this.findOne({ where: { name } });
    if (tag) {
      throw new ConflictException(NOT_UNIQUE_TAG_NAME_MSG);
    }
  }

  async findOne(options: FindOptions<Tag>): Promise<Tag> {
    return this.tagRepository.findOne(options);
  }

  findAll(options: FindAllQuery): Promise<Tag[]> {
    if (options.length < 0 || options.offset < 0) {
      throw new BadRequestException();
    }

    const queryOptions: FindOptions<Tag> & { order: Array<{}> } = { order: [] };

    if (options.length) {
      queryOptions.limit = options.length;
    }

    if (options.offset) {
      queryOptions.offset = options.offset;
    }

    if (options.sortByOrder) {
      queryOptions.order.push(['sortOrder', 'ASC']);
    }

    if (options.sortByName) {
      queryOptions.order.push(['name', 'ASC']);
    }

    return this.tagRepository.findAll(queryOptions);
  }

  async findOneById(id: number): Promise<TagWithCreatorDto> {
    const tag = await this.tagRepository.findByPk(id);
    if (!tag) {
      throw new NotFoundException(UNEXIST_TAG_ID_MSG);
    }
    const tagCreator = await tag.$get('tagCreator');
    return {
      name: tag.name,
      sortOrder: tag.sortOrder,
      creator: { uid: tagCreator.uid, nickname: tagCreator.nickname },
    };
  }

  async findOneByIdWithOwnerCheck(
    tagId: number,
    userUid: string,
  ): Promise<Tag> {
    const tag = await this.tagRepository.findByPk(tagId);
    if (!tag) {
      throw new NotFoundException(UNEXIST_TAG_ID_MSG);
    }

    if (tag.creator !== userUid) {
      throw new ForbiddenException(USER_IS_NOT_OWNER_OF_TAG_MSG);
    }

    return tag;
  }

  async updateWithOwnerCheck(
    id: number,
    updateTagDto: UpdateTagDto,
    userUid: string,
  ): Promise<TagWithCreatorDto> {
    const tag = await this.findOneByIdWithOwnerCheck(id, userUid);
    if (updateTagDto.name) {
      await this.isTagNameUniqueCheck(updateTagDto.name);
    }
    const newTag = await tag.update(updateTagDto);
    const tagCreator = await newTag.$get('tagCreator');
    return {
      creator: { nickname: tagCreator.nickname, uid: tagCreator.uid },
      name: newTag.name,
      sortOrder: newTag.sortOrder,
    };
  }

  async remove(id: number, userUid: string): Promise<void> {
    const tag = await this.findOneByIdWithOwnerCheck(id, userUid);
    await tag.destroy();
  }

  async isTagExistsCheck(id: number): Promise<void> {
    const tag = await this.tagRepository.findByPk(id);
    if (!tag) {
      throw new BadRequestException(
        `Tag with id ${id} was not found. Operation is not successful`,
      );
    }
  }
}
