import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { UserModule } from '../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './tag.model';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [forwardRef(() => UserModule), SequelizeModule.forFeature([Tag])],
  exports: [TagService],
})
export class TagModule {}
