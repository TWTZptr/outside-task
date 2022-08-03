import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../../types/jwtPayload";
import { INVALID_CREDENTIALS_MSG } from "../constants";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<JwtPayload> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MSG);
    }

    return { uid: user.uid };
  }

}