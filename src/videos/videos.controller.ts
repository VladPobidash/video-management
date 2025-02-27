import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Video } from './entities/video.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, type: Video })
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiParam({
    name: 'page',
    schema: { type: 'integer' },
    required: false,
    description: 'The page number for pagination.',
  })
  @ApiParam({
    name: 'limit',
    schema: { type: 'integer' },
    required: false,
    description: 'The number of items per page for pagination.',
  })
  @ApiResponse({ status: 200, type: [Video] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.videosService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video by ID' })
  @ApiResponse({ status: 200, type: Video })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a video by ID' })
  @ApiResponse({ status: 200, type: Video })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a video by ID' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}
