import { Module } from "@nestjs/common";
import { UserTagService } from "./user-tag.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserTag } from "./user-tag.model";

@Module({
  providers: [UserTagService],
  exports: [UserTagService],
  imports: [SequelizeModule.forFeature([UserTag])]
})
export class UserTagModule {
}
