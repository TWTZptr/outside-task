import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPair } from '../types/TokenPair';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth-guard';
import { ExtractJwt } from 'passport-jwt';
import { AuthorizedUser } from './authorized-user.decorator';
import { JwtPayload } from '../types/JwtPayload';
import { ApiBody } from '@nestjs/swagger/dist/decorators';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist/decorators';
import { User } from 'src/user/user.model';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post('signin')
  async SignIn(
    @Body() signInDto: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokenPair = await this.authService.signIn(signInDto);
    return this.processTokenPair(tokenPair, response);
  }

  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: [LoginUserDto] })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const tokenPair = this.authService.login(req.user);
    return this.processTokenPair(tokenPair, response);
  }

  private processTokenPair(tokenPair: TokenPair, response: Response) {
    response.cookie('refreshToken', tokenPair.refreshToken, {
      expires: new Date(
        Date.now() +
          +this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME'),
      ),
      sameSite: 'strict',
      httpOnly: true,
    });

    return {
      token: tokenPair.token,
      expire: this.authService.getTokenExpireTime(),
    };
  }

  @ApiOperation({ summary: 'Логаут' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
  }

  @ApiOperation({
    summary: 'Рефреш пары токенов (при наличии куки с рефреш токеном)',
  })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @AuthorizedUser() user: JwtPayload,
  ) {
    const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const accessToken = extractor(request);
    const tokenPair = await this.authService.refresh(accessToken, user);
    return this.processTokenPair(tokenPair, response);
  }
}
