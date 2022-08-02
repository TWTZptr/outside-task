import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signin')
  SignIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto);
  }
}
