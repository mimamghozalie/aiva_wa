import { Device } from "@api/v1/devices/entities/device.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum MessageType {
    text = "TEXT",
    image = "IMAGE",
    video = "VIDEO"
}

@Entity()
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.text
    })
    type: MessageType;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;

    // relations
    @ManyToOne(() => Device, d => d.deviceId)
    owner: string;
}
