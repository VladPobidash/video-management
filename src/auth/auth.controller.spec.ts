import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign in (authenticate) a user', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const result = { access_token: 'test_token' };
    jest.spyOn(authService, 'signIn').mockResolvedValue(result);

    expect(await controller.signIn(signInDto)).toBe(result);
    expect(authService.signIn).toHaveBeenCalledWith(
      signInDto.email,
      signInDto.password,
    );
  });

  it('should sign up (authorize) a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const result = { access_token: 'test_token' };
    jest.spyOn(authService, 'signUp').mockResolvedValue(result);

    expect(await controller.signUp(createUserDto)).toBe(result);
    expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
  });
});
