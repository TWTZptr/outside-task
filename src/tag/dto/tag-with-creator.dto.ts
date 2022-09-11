import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class TagWithCreatorDto {
  @ApiProperty({
    example: 'tagname',
    description: 'Название тэга',
  })
  name: string;

  @ApiProperty({
    example: '2',
    description: 'Порядок сортировки',
    required: false,
  })
  sortOrder: number;

  @ApiProperty({
    example: '2',
    description: 'Информация о создателе тега',
  })
  creator: {
    nickname: string;
    uid: string;
  };
}
