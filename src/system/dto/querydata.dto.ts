import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetQueryDto {
  @IsNotEmpty()
  page: number = 1;

  @IsNotEmpty()
  limit: number = 5;

  @IsOptional()
  orderBy: string = 'created';

  @IsOptional()
  sort: 'desc' | 'asc' = 'desc';

  @IsOptional()
  filter?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  column: string;
}
