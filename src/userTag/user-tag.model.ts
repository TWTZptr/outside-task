import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { Tag } from "../tag/tag.model";

interface UserTagCreationAttributes {
  userUid: string;
  tagId: number;
}

@Table({ tableName: 'UserTag' })
export class UserTag extends Model<UserTag, UserTagCreationAttributes> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_uid', onDelete: 'cascade' })
  userUid: string;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'tag_id', onDelete: 'cascade' })
  tagId: number;
}