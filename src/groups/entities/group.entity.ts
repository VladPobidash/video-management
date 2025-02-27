import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Video } from '../../videos/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'groups' })
export class Group {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Group Name', description: 'Name of the group' })
  @Column()
  name: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  description?: string;

  @ApiPropertyOptional()
  @Column({ name: 'parent_id', nullable: true })
  parentId?: number;

  @ApiPropertyOptional({ type: () => Group })
  @ManyToOne(() => Group, (group) => group.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Group;

  @ApiPropertyOptional({
    type: () => [Group],
    description: 'Child groups',
    default: [],
  })
  @OneToMany(() => Group, (group) => group.parent)
  children: Group[];

  @ApiPropertyOptional({
    type: () => [Video],
    description: 'Videos in the group',
    default: [],
  })
  @OneToMany(() => Video, (video) => video.group)
  videos: Video[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
