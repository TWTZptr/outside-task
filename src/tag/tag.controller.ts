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

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @AuthorizedUser() user: JwtPayload,
  ) {
    return this.tagService.create(createTagDto, user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query(new TransformEmptyStringToTruePipe()) query: FindAllQuery) {
    return this.tagService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOneById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @AuthorizedUser() user: JwtPayload,
  ) {
    return this.tagService.updateWithOwnerCheck(+id, updateTagDto, user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthorizedUser() user: JwtPayload) {
    return this.tagService.remove(+id, user.uid);
  }
}
