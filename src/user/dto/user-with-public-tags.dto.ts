import { PublicTagInfoDto } from 'src/tag/dto/public-tag-info.dto';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class UserWithPublicTagsDto {
  @ApiProperty({
    example: 'email@domain.com',
    description: 'Адрес электронной почты',
  })
  email: string;
  @ApiProperty({
    example: 'supernickname',
    description: 'Имя пользователя',
  })
  nickname: string;
  @ApiProperty({
    example: `[{
			"id": 9,
			"name": "my tag1",
			"sortOrder": 3
		},
		{
			"id": 10,
			"name": "my tag1=",
			"sortOrder": 3
		}]`,
    description: 'Список тэгов',
  })
  tags: PublicTagInfoDto[];
}
