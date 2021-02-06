import { WhatsappService } from "@libs/whatsapp/whatsapp.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DevicesEntity } from "./devices.entity";

@Injectable()
export class DevicesService {


    constructor(
        @InjectRepository(DevicesEntity) private devicesRepo: Repository<DevicesEntity>,
        private whatsappService: WhatsappService
    ) {

        // subscribe ke pengguna yang sudah melakukan pair device whatsapp mereka
        this.whatsappService.newAuth.subscribe(whatsappDevice => {
            console.log(whatsappDevice)

        })
    }

    async myDevices(author: string) {
        try {
            return await this.devicesRepo.find({ author: { id: author } })
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async addDevices(author: string, name: string) {
        const device = this.devicesRepo.insert({ name, author: { id: author } })
        return await device;
    }
}