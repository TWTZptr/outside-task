import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { MAX_USER_EMAIL_LENGTH, MAX_USER_NICKNAME_LENGTH } from './constants';
import { Tag } from '../tag/tag.model';
import { UserTag } from '../userTag/user-tag.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface UserCreationAttributes {
  email: string;
  password: string;
  nickname: string;
}

@Table({ tableName: 'User' })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({
    example: '0c175aa2-7484-4d04-9ad2-98f304fb6fd7',
    description: 'UID юзера',
  })
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  uid: string;

  @ApiProperty({
    example: 'email@domain.com',
    description: 'Адрес электронной почты',
  })
  @Column({
    type: DataType.STRING(MAX_USER_EMAIL_LENGTH),
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'strongPASSWORD222',
    description: 'Пароль',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({
    example: 'supernickname',
    description: 'Имя пользователя',
  })
  @Column({ type: DataType.STRING(MAX_USER_NICKNAME_LENGTH), allowNull: false })
  nickname: string;

  @HasMany(() => Tag, 'creator')
  createdTags: Tag[];

  @BelongsToMany(() => Tag, () => UserTag)
  tags: Array<Tag & { UserTag: UserTag }>;
}
