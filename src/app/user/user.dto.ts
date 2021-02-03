import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from './user.model';

export class UserRO {
  id: string;
  email: string;
  fullname: string;
  token?: string;
  role?: UserRole;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  newPassword: string;
}

export class UpdateUserDto {
  
  @IsNotEmpty()
  @MinLength(5)
  fullname: string;

  
  role: string;

  
  status: string;
}

export class GetUsersDto {
  
  @IsNotEmpty()
  page: number;

  
  @IsNotEmpty()
  limit: number;

 
  @IsNotEmpty()
  orderBy: 'fullname' | 'email' | 'status' | 'created';

  
  @IsNotEmpty()
  sort: 'asc' | 'desc';

  
  @IsOptional()
  filter: 'fullname' | 'email' | 'status';

  
  @IsOptional()
  filterValue: string;

  
  @IsOptional()
  search: string;
}

export class UpdateManyUserDto {
  
  @IsNotEmpty()
  id: string[];

  
  @IsNotEmpty()
  data: UpdateUserDto;
}

export class DeleteManyUserDto {
  
  @IsNotEmpty()
  id: string[];
}

export interface GetUsers {
  page: number;
  limit: number;
  orderBy: string;
  sort: 'DESC' | 'ASC';
  filter?: string;
  filterValue?: string;
  search?: string;
}
