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
    ) {
        this.whatsappService.initInstance('41c5d8bd-152b-4836-9410-91e09c194ef6', {
            WABrowserId: '"C7r1G0KVTZfEQujj3g5G+Q=="',
            WASecretBundle: '{"key":"C2Ujtw0kaHHKvwkHK+jURLuxf3i/IjJ3lX3eYKQ3+CI=","encKey":"vLwaPJvv6PPMlUaqcYkgPd62tRdOtLKjxAB8Vakdudc=","macKey":"C2Ujtw0kaHHKvwkHK+jURLuxf3i/IjJ3lX3eYKQ3+CI="}',
            WAToken1: '"DCErhcR+5juAJaVIBwfAQ6HbKSEH62S+h4QEBiWZ6w8="',
            WAToken2: '"1@okVpg2oKOJhddSYTmuFOmQABrosTkg64PozZm1oUHI8IinFhQCm0SVC2hwJRSxFCbSZhaEV0gJYlhA=="'
        }).then(r => {
            console.log(r);
        }).catch(err => console.log(`error found ${err.message}`))
    }

    @Get('/whatsapp-connected-devices')
    async wcd() {
        return this.whatsappService.getTotalInstance()
    }

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
        return await this.whatsappService.initInstance(deviceId);
    }



}