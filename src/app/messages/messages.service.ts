import { WhatsappService } from "@libs/whatsapp/whatsapp.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessagesEntity } from "./messages.entity";


@Injectable()
export class MessagesService {

    constructor(
        @InjectRepository(MessagesEntity) private msgRepo: Repository<MessagesEntity>,
        private whatsappService: WhatsappService
    ) { }

    async sendMessage(msg: string, phone: string, deviceId: string) {

        const msgData = await this.whatsappService.sendMessage(deviceId, phone, msg);

        if (msgData.error) {
            throw new BadRequestException();
        }

        const payload = this.msgRepo.create({
            message: msg,
            devices: {
                deviceId
            },
            messageType: 'send',
            msgId: msgData.data?.id.id,
            messageData: msgData.data
        });

        await this.msgRepo.insert(payload)

        return {
            error: false,
            message: 'Messege send successfully'
        }
    }

    async getDeviceMessage(deviceId: string) {
        try {
            const msgs = await this.msgRepo.find({ where: { devices: { deviceId } } });

            return {
                data: msgs
            }
        } catch (error) {
            throw new BadRequestException()
        }
    }
}