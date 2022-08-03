import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../../types/JwtPayload";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwtRefresh") {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.refreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET")
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    const { iat, exp, ...res } = payload;
    return res;
  }
}