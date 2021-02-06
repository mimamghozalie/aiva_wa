import { WhatsappService } from "@libs/whatsapp/whatsapp.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessagesEntity } from "./messages.entity";


@Injectable()
export class MessagesService {

    constructor(
        @InjectRepository(MessagesEntity) private msgRepo: Repository<MessagesEntity>,
        private whatsappService: WhatsappService
    ) { }

    // sendMessage(msg: string, to: number, deviceId: string) {

    //     const msgData = await this.whatsappService.
    // }
}