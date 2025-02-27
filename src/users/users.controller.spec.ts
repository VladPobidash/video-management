import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: 1, name: 'Test User' }]),
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
            create: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
            update: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Updated User' }),
            remove: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
