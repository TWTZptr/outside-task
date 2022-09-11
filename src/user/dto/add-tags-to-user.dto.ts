import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class AddTagsToUserDto {
  @ApiProperty({
    example: "['1', '2']",
    description: 'id тэгов, добавляемых пользователю',
  })
  tags: number[];
}
