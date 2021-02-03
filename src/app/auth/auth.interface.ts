import { IsNotEmpty, MinLength, IsEmail, IsString } from 'class-validator';


export class LoginUserDto {
 
  @IsNotEmpty()
  @MinLength(5)
  @IsEmail()
  email: string;

 
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterUserDto {
  
  @IsNotEmpty()
  firstName: string;

  
  @IsNotEmpty()
  lastName: string;

  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  
  @IsNotEmpty()
  password?: string;

  role?: string;
  status?: string;
}

export class ForgotEmailDto {
 
  @IsNotEmpty()
  @MinLength(5)
  @IsEmail()
  email: string;
}
