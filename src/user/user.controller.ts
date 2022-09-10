import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizedUser } from '../auth/authorized-user.decorator';
import { JwtPayload } from '../types/JwtPayload';
import { Response } from 'express';
import { TagService } from 'src/tag/tag.service';
import { AddTagsToUserDto } from './dto/add-tags-to-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tagServce: TagService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.getUserWithTags(userPayload.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @AuthorizedUser() userPayload: JwtPayload,
  ) {
    return this.userService.update(userPayload.uid, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @AuthorizedUser() userPayload: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refreshToken');
    await this.userService.tryRemoveUserAndHisTags(userPayload.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tag')
  async addTagsToUser(
    @AuthorizedUser() userPayload: JwtPayload,
    @Body() addTagsToUserDto: AddTagsToUserDto,
  ) {
    const tags = await this.userService.tryToAddTagsToUser(
      userPayload.uid,
      addTagsToUserDto.tags,
    );
    return { tags };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('tag/:id')
  async removeTagFromUser(
    @Param('id') tagId: number,
    @AuthorizedUser() userPayload: JwtPayload,
  ) {
    return this.userService.deleteTagFromUser(userPayload.uid, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tag/my')
  async getUserTags(@AuthorizedUser() userPayload: JwtPayload) {
    const tags = await this.userService.getUserTags(userPayload.uid);
    return { tags };
  }
}
