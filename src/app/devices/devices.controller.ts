import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "@system/decorators/user.decorator";
import { AuthGuard } from "@system/guards/auth/auth.guard";
import { NewDevices } from "./devices.interface";

@UseGuards(new AuthGuard())
@Controller()
export class DevicesController{
    constructor() {}

    @Post()
    newDevices(@User() user, @Body() body: NewDevices) {
        return {user, body};
    }
}