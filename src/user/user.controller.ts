import { Body, Controller, Delete, Get, Put, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthorizedUser } from "../auth/authorized-user.decorator";
import { JwtPayload } from "../types/JwtPayload";
import { Response } from "express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.findOneByUid(userPayload.uid, ["uid"]);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.update(userPayload.uid, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@AuthorizedUser() userPayload: JwtPayload, @Res({ passthrough: true }) response: Response) {
    response.clearCookie("refreshToken");
    return this.userService.tryRemove(userPayload.uid);
  }
}
