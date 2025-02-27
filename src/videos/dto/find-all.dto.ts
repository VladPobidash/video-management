import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllDto extends PaginationDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  groupId?: number;
}
