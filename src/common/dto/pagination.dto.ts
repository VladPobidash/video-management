import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value as string, 10))
  page?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value as string, 10))
  limit?: number;
}
