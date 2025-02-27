import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    type: Group,
    description: 'The record has been successfully created.',
  })
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
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
  @ApiResponse({ status: 201, type: [Group] })
  findAll(@Query() dto: FindAllDto) {
    return this.groupsService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, type: Group })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group by ID' })
  @ApiResponse({ status: 200, type: Group })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a group by ID' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupsService.remove(id);
  }
}
