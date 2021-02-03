import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetQueryData {
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
  filterValue?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  searchValue?: string;
}
