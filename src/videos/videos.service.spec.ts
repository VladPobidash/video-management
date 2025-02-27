import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';

describe('VideosService', () => {
  let service: VideosService;
  let repository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    repository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a video', async () => {
      const dto = {
        title: 'Test Video',
        url: 'https://example.com',
        groupId: 1,
      };
      const video = { id: 1, ...dto };

      jest.spyOn(repository, 'create').mockReturnValue(video);
      jest.spyOn(repository, 'save').mockResolvedValue(video);

      expect(await service.create(dto)).toEqual(video);
    });

    it('should throw an exception if creation fails', async () => {
      const dto = { title: 'Test Video', url: 'https://example.com' };

      jest.spyOn(repository, 'create').mockReturnValue({ id: 1, ...dto });
      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of videos with all DTO parameters', async () => {
      const groups = [
        {
          id: 1,
          title: 'Test Video 1',
          url: 'https://example1.com',
          groupId: 1,
        },
        {
          id: 2,
          title: 'Test Video 2',
          url: 'https://example2.com',
          groupId: 2,
        },
        {
          id: 3,
          title: 'Test Video 3',
          url: 'https://example3.com',
          groupId: 1,
        },
      ];

      const filtered = [groups[0], groups[2]];

      const findAllDto = { groupId: 1, page: 1, limit: 10 };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(filtered),
      } as any);

      expect(await service.findAll(findAllDto)).toEqual(filtered);
    });
  });

  describe('findOne', () => {
    it('should return a video', async () => {
      const video = { id: 1, title: 'Test Video', url: 'https://example.com' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(video);

      expect(await service.findOne({ id: 1 })).toEqual(video);
    });

    it('should throw a NotFoundException if video not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a video', async () => {
      const dto = { title: 'Updated Video' };
      const video = { id: 1, title: 'Test Video', url: 'https://example.com' };
      const updatedVideo = { ...video, ...dto };

      jest.spyOn(service, 'findOne').mockResolvedValue(video);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedVideo);

      expect(await service.update(1, dto)).toEqual(updatedVideo);
    });

    it('should throw a NotFoundException if video not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException if update fails', async () => {
      const dto = { title: 'Updated Video' };
      const video = { id: 1, title: 'Test Video', url: 'https://example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(video);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.update(1, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a video', async () => {
      const video = { id: 1, title: 'Test Video', url: 'https://example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(video);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ raw: {}, affected: 1 });

      expect(await service.remove(1)).toBeUndefined();
    });

    it('should throw an InternalServerErrorException if remove fails', async () => {
      const video = { id: 1, title: 'Test Video', url: 'https://example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(video);
      jest.spyOn(repository, 'delete').mockRejectedValue(new Error());

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
