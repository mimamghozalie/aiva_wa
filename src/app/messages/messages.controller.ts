import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";


@Controller()
export class MessageController {

    constructor(
        private messageService: MessagesService
    ) { }

    @Get('/:deviceId')
    deviceMessage(@Param('deviceId') deviceId: string) {
        return this.messageService.getDeviceMessage(deviceId)
    }


    @Post('/:deviceId/send')
    sendMessage(@Param('deviceId') deviceId: string, @Body() body) {
        return this.messageService.sendMessage(body.message, body.phone, deviceId)

    }
}