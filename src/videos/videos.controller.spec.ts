import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

describe('VideosController', () => {
  let controller: VideosController;
  let service: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: VideosService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((group: CreateVideoDto) =>
                Promise.resolve({ id: 1, ...group }),
              ),
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: 1, title: 'Test Video 1' }]),
            findOne: jest
              .fn()
              .mockImplementation(({ id }: { id: number }) =>
                Promise.resolve({ id, title: 'Test Video' }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, group: UpdateVideoDto) =>
                Promise.resolve({ id, ...group }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideosController>(VideosController);
    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a video', async () => {
    const dto = { title: 'New Video', url: 'https://example.com' };

    expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of videos', async () => {
    const where = { title: 'Test Video 1', page: 1, limit: 10 };

    expect(await controller.findAll(where)).toEqual([
      { id: 1, title: 'Test Video 1' },
    ]);
    expect(service.findAll).toHaveBeenCalledWith(where);
  });

  it('should return a single video', async () => {
    const id = 1;

    expect(await controller.findOne(id)).toEqual({ id, title: 'Test Video' });
    expect(service.findOne).toHaveBeenCalledWith({ id });
  });

  it('should update a group', async () => {
    const id = 1;
    const updateGroupDto = { title: 'Updated Video' };

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
