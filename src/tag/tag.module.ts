import { Module } from "@nestjs/common";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { UserModule } from "../user/user.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tag } from "./tag.model";

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [UserModule, SequelizeModule.forFeature([Tag])]
})
export class TagModule {
}
