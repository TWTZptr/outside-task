import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { PasswordModule } from '../password/password.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User]),
    PasswordModule,
    forwardRef(() => TagModule),
  ],
  exports: [UserService],
})
export class UserModule {}
