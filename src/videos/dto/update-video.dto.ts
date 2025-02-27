import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateVideoDto {
  @ApiPropertyOptional({
    example: 'Video Name',
    description: 'Name of the video',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://youtu.be/a-LIyHVUnBk?si=JU017fQHHe05TnH2',
    description: 'URL of the video',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Group of the video',
  })
  @IsOptional()
  @IsPositive()
  groupId?: number;
}
