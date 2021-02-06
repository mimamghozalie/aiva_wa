import { WhatsappModule } from "@libs/whatsapp/whatsapp.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DevicesController } from "./devices.controller";
import { DevicesEntity } from "./devices.entity";
import { DevicesService } from "./devices.service";


@Module({
    imports: [TypeOrmModule.forFeature([DevicesEntity]), WhatsappModule],
    controllers: [DevicesController],
    providers: [DevicesService]
})
export class DevicesModule { }