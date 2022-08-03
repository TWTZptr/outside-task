import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { SigninDto } from "./dto/signin.dto";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { Op } from "sequelize";
import {
  ACCESS_TOKEN_REQUIRED_MSG,
  BROKEN_ACCESS_TOKEN_MSG,
  NOT_UNIQUE_EMAIL_MSG,
  NOT_UNIQUE_NICKNAME_MSG
} from "./constants";
import { PasswordService } from "../password/password.service";
import { JwtService } from "@nestjs/jwt";
import { TokenPair } from "../types/TokenPair";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/JwtPayload";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly passwordService: PasswordService,
              private readonly jwtService: JwtService,
              private readonly configService: ConfigService) {
  }

  async signIn(signInDto: SigninDto): Promise<TokenPair> {
    const existingUser = await this.userService.findOne({
      where: {
        [Op.or]: [{ nickname: signInDto.nickname }, { email: signInDto.email }]
      }
    });

    if (existingUser) {
      if (existingUser.email === signInDto.email) {
        throw new ConflictException(NOT_UNIQUE_EMAIL_MSG);
      } else {
        throw new ConflictException(NOT_UNIQUE_NICKNAME_MSG);
      }
    }

    const hashedPassword = await this.passwordService.hash(signInDto.password);

    const user = await this.userService.create({ ...signInDto, password: hashedPassword });
    return this.generateTokenPair({ uid: user.uid });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ where: { email } });
    if (user && await this.passwordService.compare(password, user.password)) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  private generateTokenPair(payload: JwtPayload): TokenPair {
    return {
      token: `Bearer ${this.jwtService.sign(payload)}`,
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRATION_TIME")
      })
    };
  }

  login(jwtPayload: JwtPayload): TokenPair {
    return this.generateTokenPair(jwtPayload);
  }

  getTokenExpireTime(): number {
    return +this.configService.get<string>("ACCESS_TOKEN_EXPIRATION_TIME") / 1000;
  }

  async refresh(accessToken: string, userPayload: JwtPayload): Promise<TokenPair> {
    if (!accessToken) {
      throw new ForbiddenException(ACCESS_TOKEN_REQUIRED_MSG);
    }

    const accessTokenPayload = this.jwtService.decode(accessToken);

    if (typeof accessTokenPayload === "string" || userPayload.uid !== accessTokenPayload.uid) {
      throw new ForbiddenException(BROKEN_ACCESS_TOKEN_MSG);
    }

    const user = await this.userService.findOneByUid(userPayload.uid);

    if (!user) {
      throw new ForbiddenException(BROKEN_ACCESS_TOKEN_MSG);
    }

    return this.generateTokenPair({ uid: user.uid });
  }
}
