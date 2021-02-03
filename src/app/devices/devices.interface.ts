import { IsNotEmpty } from "class-validator";


export class NewDevices {
    @IsNotEmpty()
    name: string;    
}