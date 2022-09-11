import { PublicTagInfoDto } from 'src/tag/dto/public-tag-info.dto';
import { Tag } from 'src/tag/tag.model';

export const mapTagToPublicTagInfo = (tags: Tag[]): PublicTagInfoDto[] => {
  return tags.map(({ id, name, sortOrder }) => ({ id, name, sortOrder }));
};
