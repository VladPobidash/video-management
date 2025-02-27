import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group Name', description: 'Name of the group' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  parentId?: number;
}
