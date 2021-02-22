import { IsNotEmpty, IsOptional } from "class-validator";

export class AuthRegisterDto {

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    phone: number;
}