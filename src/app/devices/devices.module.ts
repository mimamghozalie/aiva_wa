import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DevicesController } from "./devices.controller";
import { DevicesEntity } from "./devices.entity";
import { DevicesService } from "./devices.service";


@Module({
    imports: [TypeOrmModule.forFeature([DevicesEntity])],
    controllers: [DevicesController],
    providers: [DevicesService]
})
export class DevicesModule{}