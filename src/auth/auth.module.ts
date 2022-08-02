import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PasswordModule } from '../password/password.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, PasswordModule],
})
export class AuthModule {
}
