import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { email: 'test@mail.com', password: 'password' };
      const video = { id: 1, ...dto };

      jest.spyOn(repository, 'create').mockReturnValue(video);
      jest.spyOn(repository, 'save').mockResolvedValue(video);

      expect(await service.create(dto)).toEqual(video);
    });

    it('should throw an exception if creation fails', async () => {
      const dto = { email: 'test@mail.com', password: 'password' };

      jest.spyOn(repository, 'create').mockReturnValue({ id: 1, ...dto });
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: 1, email: 'test@mail.com', password: 'password' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      expect(await service.findOne({ id: 1 })).toEqual(user);
    });

    it('should throw a NotFoundException if video not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
