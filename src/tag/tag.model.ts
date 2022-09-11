import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { MAX_TAG_NAME_LENGTH } from './constants';
import { User } from '../user/user.model';
import { UserTag } from '../userTag/user-tag.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface TagCreationAttributes {
  creator: string;
  name: string;
  sortOrder?: number;
}

@Table({ tableName: 'Tag' })
export class Tag extends Model<Tag, TagCreationAttributes> {
  @ApiProperty({
    example: '2',
    description: 'Айди тэга',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '0c175aa2-7484-4d04-9ad2-98f304fb6fd7',
    description: 'UID создателя',
  })
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'cascade' })
  creator: string;

  @ApiProperty({
    example: 'имятэга',
    description: 'Имя тэга',
  })
  @Column({
    type: DataType.STRING(MAX_TAG_NAME_LENGTH),
    allowNull: false,
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: '2',
    description: 'Порядок сортировки',
    required: false,
  })
  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  sortOrder: number;

  @BelongsTo(() => User, 'creator')
  tagCreator: User;

  @BelongsToMany(() => User, () => UserTag)
  users: Array<User & { UserTag: UserTag }>;
}
