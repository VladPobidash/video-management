import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: 'Video Name', description: 'Name of the video' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'https://youtu.be/a-LIyHVUnBk?si=JU017fQHHe05TnH2',
    description: 'URL of the video',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  groupId?: number;
}
