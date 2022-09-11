import { PublicTagInfoDto } from 'src/tag/dto/public-tag-info.dto';

export class UserWithPublicTagsDto {
  email: string;
  nickname: string;
  tags: PublicTagInfoDto[];
}
