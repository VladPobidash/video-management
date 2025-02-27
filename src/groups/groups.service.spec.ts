import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let repository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    repository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const dto = { name: 'Test Group', parentId: 1 };
      const group = { id: 1, ...dto } as Group;

      jest.spyOn(repository, 'create').mockReturnValue(group);
      jest.spyOn(repository, 'save').mockResolvedValue(group);

      expect(await service.create(dto)).toEqual(group);
    });

    it('should throw an exception if creation fails', async () => {
      const createGroupDto: CreateGroupDto = { name: 'Test Group' };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue({ id: 1, name: createGroupDto.name } as Group);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.create(createGroupDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of groups with all DTO parameters', async () => {
      const groups = [
        { id: 1, name: 'Test Group 1', description: 'Description 1' } as Group,
        { id: 2, name: 'Test Group 2', description: 'Description 2' } as Group,
        { id: 3, name: 'Test Group 3', description: 'Description 3' } as Group,
      ];

      const filtered = [groups[0]];

      const findAllDto = {
        name: 'Test Group 1',
        description: 'Description 1',
        page: 1,
        limit: 10,
      };

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
    it('should return a group', async () => {
      const group = { id: 1, name: 'Test Group' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(group as Group);

      expect(await service.findOne({ id: 1 })).toEqual(group);
    });

    it('should throw a NotFoundException if group not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };
      const group = { id: 1, name: 'Test Group' };
      const updatedGroup = { ...group, ...updateGroupDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(group as Group);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedGroup as Group);

      expect(await service.update(1, updateGroupDto)).toEqual(updatedGroup);
    });

    it('should throw a NotFoundException if group not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException if update fails', async () => {
      const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };
      const group = { id: 1, name: 'Test Group' };

      jest.spyOn(service, 'findOne').mockResolvedValue(group as Group);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.update(1, updateGroupDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      const group = { id: 1, name: 'Test Group' };

      jest.spyOn(service, 'findOne').mockResolvedValue(group as Group);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ raw: {}, affected: 1 });

      expect(await service.remove(1)).toBeUndefined();
    });

    it('should throw an InternalServerErrorException if remove fails', async () => {
      const group = { id: 1, name: 'Test Group' };

      jest.spyOn(service, 'findOne').mockResolvedValue(group as Group);
      jest.spyOn(repository, 'delete').mockRejectedValue(new Error());

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
