import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    to: number;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    token: string;
}
