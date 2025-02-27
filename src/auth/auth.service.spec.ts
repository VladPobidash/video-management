import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token if credentials are valid', async () => {
      const user: User = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashedPassword',
      };
      const token = 'jwtToken';

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.signIn('test@mail.com', 'password');

      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        service['validateUser']({ email: 'none', password: 'none' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a token', async () => {
      const createUserDto = { email: 'test2@mail.com', password: 'password' };
      const token = 'jwtToken';

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((pass, salt, cb) => cb?.(null, 'hashedPassword'));
      jest
        .spyOn(userService, 'create')
        .mockResolvedValue({ id: 1, ...createUserDto });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.signUp(createUserDto);

      expect(result).toEqual({ access_token: token });
    });
  });

  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      const user: User = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashedPassword',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const result = await service['validateUser'](user);

      expect(result).toEqual(user);
    });
  });

  describe('generateToken', () => {
    it('should return a JWT token', async () => {
      const user: User = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashedPassword',
      };
      const token = 'jwtToken';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service['generateToken'](user);

      expect(result).toEqual({ access_token: token });
    });
  });
});
