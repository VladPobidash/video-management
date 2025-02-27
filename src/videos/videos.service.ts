import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto) {
    try {
      const video = this.videosRepository.create(createVideoDto);

      return await this.videosRepository.save(video);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot create a video',
          error,
        });
      }
    }
  }

  findAll({ title, description, groupId, page = 1, limit = 10 }: FindAllDto) {
    const query = this.videosRepository.createQueryBuilder();

    if (title) {
      query.where('title = :title', { title });
    }

    if (description) {
      query.andWhere('description = :description', { description });
    }

    if (groupId) {
      query.andWhere('group_id = :groupId', { groupId });
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(where: FindOptionsWhere<Video>) {
    const video = await this.videosRepository.findOne({
      where,
      relations: ['group'],
    });

    if (!video) {
      throw new NotFoundException(`Video not found`);
    }

    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.findOne({ id });

    try {
      return await this.videosRepository.save({ ...video, ...updateVideoDto });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot update the video',
          error,
        });
      }
    }
  }

  async remove(id: number) {
    try {
      await this.videosRepository.delete({ id });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot remove the video',
          error,
        });
      }
    }
  }
}
