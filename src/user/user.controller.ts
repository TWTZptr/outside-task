import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthorizedUser } from "../auth/authorized-user.decorator";
import { JwtPayload } from "../types/JwtPayload";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.findOneByUid(userPayload.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.update(userPayload.uid, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
