import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  parentId?: number;
}
