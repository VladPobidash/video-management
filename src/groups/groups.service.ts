import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      const group = this.groupsRepository.create(createGroupDto);

      return await this.groupsRepository.save(group);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot create a group',
          error,
        });
      }
    }
  }

  findAll({ name, description, page = 1, limit = 10 }: FindAllDto) {
    const query = this.groupsRepository.createQueryBuilder();

    if (name) {
      query.where('name = :name', { name });
    }

    if (description) {
      query.andWhere('description = :description', { description });
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(where: FindOptionsWhere<Group>) {
    const group = await this.groupsRepository.findOne({
      where,
      relations: ['parent', 'children'],
    });

    if (!group) {
      throw new NotFoundException(`Group not found`);
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne({ id });

    try {
      return await this.groupsRepository.save({ ...group, ...updateGroupDto });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot update the group',
          error,
        });
      }
    }
  }

  async remove(id: number) {
    try {
      await this.groupsRepository.delete({ id });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: 'Cannot remove the group',
          error,
        });
      }
    }
  }
}
