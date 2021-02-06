import { WhatsappService } from "@libs/whatsapp/whatsapp.service";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { User } from "@system/decorators/user.decorator";
import { AuthGuard } from "@system/guards/auth/auth.guard";
import { NewDevices } from "./devices.interface";
import { DevicesService } from "./devices.service";

@UseGuards(new AuthGuard())
@Controller()
export class DevicesController {
    constructor(
        private deviceService: DevicesService,
        private whatsappService: WhatsappService
    ) { }

    @Get()
    async myDevices(@User() user) {
        return await this.deviceService.myDevices(user.uid);
    }

    @Post()
    async newDevices(@User() user, @Body() body: NewDevices) {
        return await this.deviceService.addDevices(user.uid, body.name)
    }

    @Get('/:deviceId/pair')
    async pairDevice(@User() user, @Param('deviceId') deviceId: string) {
        console.log(`Pairing device ${deviceId}`)
        return await this.whatsappService.initInstance(user.uid);
    }

}