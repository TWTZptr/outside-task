import {
  BadRequestException,
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
import { AddTagsToUserDto } from './dto/add-tags-to-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist/decorators';
import { UserWithPublicTagsDto } from './dto/user-with-public-tags.dto';
import { User } from './user.model';
import { UNSPECIFIED_TAGS_MSG } from './constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получение данных о юзере с его тэгами' })
  @ApiResponse({ status: 200, type: UserWithPublicTagsDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@AuthorizedUser() userPayload: JwtPayload) {
    return this.userService.getUserWithTags(userPayload.uid);
  }

  @ApiOperation({ summary: 'Обновление данных о юзере' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Put()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @AuthorizedUser() userPayload: JwtPayload,
  ) {
    return this.userService.update(userPayload.uid, updateUserDto);
  }

  @ApiOperation({ summary: 'Удаление юзера' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @AuthorizedUser() userPayload: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refreshToken');
    await this.userService.tryRemoveUserAndHisTags(userPayload.uid);
  }

  @ApiOperation({ summary: 'Добавление тэгов к юзеру' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('tag')
  async addTagsToUser(
    @AuthorizedUser() userPayload: JwtPayload,
    @Body() addTagsToUserDto: AddTagsToUserDto,
  ) {
    if (!addTagsToUserDto.tags) {
      throw new BadRequestException(UNSPECIFIED_TAGS_MSG);
    }

    if (!Array.isArray(addTagsToUserDto.tags)) {
      addTagsToUserDto.tags = [addTagsToUserDto.tags];
    }

    const tags = await this.userService.tryToAddTagsToUser(
      userPayload.uid,
      addTagsToUserDto.tags,
    );
    return { tags };
  }

  @ApiOperation({ summary: 'Удаление тегов от юзера' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete('tag/:id')
  async removeTagFromUser(
    @Param('id') tagId: number,
    @AuthorizedUser() userPayload: JwtPayload,
  ) {
    return this.userService.deleteTagFromUser(userPayload.uid, tagId);
  }

  @ApiOperation({ summary: 'Получение тэгов юзера' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('tag/my')
  async getUserTags(@AuthorizedUser() userPayload: JwtPayload) {
    const tags = await this.userService.getUserTags(userPayload.uid);
    return { tags };
  }
}
