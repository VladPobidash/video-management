import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((group: CreateGroupDto) =>
                Promise.resolve({ id: 1, ...group }),
              ),
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: 1, name: 'Test Group 1' }]),
            findOne: jest
              .fn()
              .mockImplementation(({ id }: { id: number }) =>
                Promise.resolve({ id, name: 'Test Group' }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, group: UpdateGroupDto) =>
                Promise.resolve({ id, ...group }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a group', async () => {
    const createGroupDto: CreateGroupDto = { name: 'New Group' };

    expect(await controller.create(createGroupDto)).toEqual({
      id: 1,
      ...createGroupDto,
    });
    expect(service.create).toHaveBeenCalledWith(createGroupDto);
  });

  it('should return an array of groups', async () => {
    const where = { name: 'Test Group 1', page: 1, limit: 10 };

    expect(await controller.findAll(where)).toEqual([
      { id: 1, name: 'Test Group 1' },
    ]);
    expect(service.findAll).toHaveBeenCalledWith(where);
  });

  it('should return a single group', async () => {
    const id = 1;

    expect(await controller.findOne(id)).toEqual({
      id,
      name: 'Test Group',
    });
    expect(service.findOne).toHaveBeenCalledWith({ id });
  });

  it('should update a group', async () => {
    const id = 1;
    const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };

    expect(await controller.update(id, updateGroupDto)).toEqual({
      id,
      ...updateGroupDto,
    });
    expect(service.update).toHaveBeenCalledWith(id, updateGroupDto);
  });

  it('should remove a group', async () => {
    const id = 1;

    await controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
