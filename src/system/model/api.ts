export interface ApiResponse {
  message?: string;
  data?: any;
  total?: number;
  statusCode: number;
}

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
  column?: any;

  @IsOptional()
  filter?: string;

  @IsOptional()
  search?: string;
}
