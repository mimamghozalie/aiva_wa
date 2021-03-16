import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    phone: number;

    @IsOptional()
    role: any;
}
