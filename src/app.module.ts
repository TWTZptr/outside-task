import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { SequelizeConfigService } from "./config/sequelize.config.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PasswordModule } from "./password/password.module";
import { TagModule } from "./tag/tag.module";
import { UserTagModule } from "./userTag/user-tag.module";
import { UserTagService } from "./userTag/user-tag.service";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService
    }),
    UserModule,
    AuthModule,
    PasswordModule,
    TagModule,
    UserTagModule
  ],
  controllers: [AppController],
  providers: [AppService, UserTagService]
})
export class AppModule {
}
