import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizedUser } from '../auth/authorized-user.decorator';
import { JwtPayload } from '../types/JwtPayload';
import { FindAllQuery } from './types/find-all-query.type';
import { TransformEmptyStringToTruePipe } from './pipes/transform-empty-string-to-boolean.pipe';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist/decorators';
import { Tag } from './tag.model';
import { TagWithCreatorDto } from './dto/tag-with-creator.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Создание тэга' })
  @ApiResponse({ status: 200, type: Tag })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @AuthorizedUser() user: JwtPayload,
  ) {
    return this.tagService.create(createTagDto, user.uid);
  }

  @ApiOperation({ summary: 'Поиск тэгов' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query(new TransformEmptyStringToTruePipe()) query: FindAllQuery) {
    return this.tagService.findAll(query);
  }

  @ApiOperation({ summary: 'Поиск тэга' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOneById(+id);
  }

  @ApiOperation({ summary: 'Обновление тэга' })
  @ApiResponse({ status: 200, type: TagWithCreatorDto })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @AuthorizedUser() user: JwtPayload,
  ) {
    return this.tagService.updateWithOwnerCheck(+id, updateTagDto, user.uid);
  }

  @ApiOperation({ summary: 'Удаление тэга' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthorizedUser() user: JwtPayload) {
    return this.tagService.remove(+id, user.uid);
  }
}
