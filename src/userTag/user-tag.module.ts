import { Module } from '@nestjs/common';
import { UserTagService } from './user-tag.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTag } from './user-tag.model';

@Module({
  providers: [UserTagService],
  imports: [SequelizeModule.forFeature([UserTag])],
  exports: [UserTagService],
})
export class UserTagModule {}
