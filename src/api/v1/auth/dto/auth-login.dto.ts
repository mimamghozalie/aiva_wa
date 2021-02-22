import { IsNotEmpty, IsOptional } from "class-validator";

export class AuthLoginDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    phone: number;
}