import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.validateUser({ email, password });

    return this.generateToken(user);
  }

  async signUp(userDto: CreateUserDto) {
    const candidate = await this.userService.findOne({ email: userDto.email });

    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });

    if (!user) {
      throw new BadRequestException('User was not created');
    }

    return this.generateToken(user);
  }

  private async validateUser({ email, password }: CreateUserDto) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const passwordEquals = await bcrypt.compare(password, user.password);

    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException('Incorrect email or password');
  }

  private async generateToken({ id, email }: User) {
    const payload = { sub: id, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
