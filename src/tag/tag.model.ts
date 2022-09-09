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

interface TagCreationAttributes {
  creator: string;
  name: string;
  sortOrder?: number;
}

@Table({ tableName: 'Tag' })
export class Tag extends Model<Tag, TagCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'cascade' })
  creator: string;

  @Column({
    type: DataType.STRING(MAX_TAG_NAME_LENGTH),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  sortOrder: number;

  @BelongsTo(() => User, 'creator')
  tagCreator: User;

  @BelongsToMany(() => User, () => UserTag)
  users: Array<User & { UserTag: UserTag }>;
}
