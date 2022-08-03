import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { MAX_USER_EMAIL_LENGTH, MAX_USER_NICKNAME_LENGTH } from "./constants";
import { Tag } from "../tag/tag.model";

interface UserCreationAttributes {
  email: string;
  password: string;
  nickname: string;
}

@Table({ tableName: "User" })
export class User extends Model<User, UserCreationAttributes> {
  @Column({ type: DataType.UUID, allowNull: false, primaryKey: true, defaultValue: DataType.UUIDV4 })
  uid: string;

  @Column({ type: DataType.STRING(MAX_USER_EMAIL_LENGTH), allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(MAX_USER_NICKNAME_LENGTH), allowNull: false })
  nickname: string;

  @HasMany(() => Tag, "creator")
  createdTags: Tag[];
}