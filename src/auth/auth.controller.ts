import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signin.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { TokenPair } from "../types/TokenPair";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
  }

  @Post("signin")
  async SignIn(@Body() signInDto: SigninDto, @Res({ passthrough: true }) response: Response) {
    const tokenPair = await this.authService.signIn(signInDto);
    return this.sendToken(tokenPair, response);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const tokenPair = this.authService.login(req.user);
    return this.sendToken(tokenPair, response);
  }

  private sendToken(tokenPair: TokenPair, response: Response) {
    response.cookie("refreshToken", tokenPair.refreshToken, {
      expires: new Date(Date.now() + +this.configService.get<string>("REFRESH_TOKEN_EXPIRATION_TIME")),
      sameSite: "strict",
      httpOnly: true,
      secure: true
    });

    return { token: tokenPair.token, expire: this.authService.getTokenExpireTime() };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("refreshToken");
  }
}
