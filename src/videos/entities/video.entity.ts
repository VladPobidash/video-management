import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';

@Entity({ name: 'videos' })
export class Video {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Video Title', description: 'Title of the video' })
  @Column()
  title: string;

  @ApiProperty({
    example: 'https://youtu.be/_FAX7Hj7Iag?si=wdrMwXUOhwU5wqc7',
    description: 'URL of the video',
  })
  @Column()
  url: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  description?: string;

  @ApiPropertyOptional()
  @Column({ name: 'group_id', nullable: true })
  groupId?: number;

  @ApiPropertyOptional({ type: () => Group, description: 'Parent group' })
  @ManyToOne(() => Group, (group) => group.videos, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: Group;
}
