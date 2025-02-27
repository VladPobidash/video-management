import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);

      return this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot create a user',
          error,
        });
      }
    }
  }

  async findOne(options: FindOptionsWhere<User>) {
    const user = await this.usersRepository.findOneBy(options);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }
}
