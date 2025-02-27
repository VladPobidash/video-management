import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Video } from '../videos/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Video])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
