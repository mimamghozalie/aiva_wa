import { DevicesEntity } from "@app/devices/devices.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('messages')
export class MessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    message_id: string;

    @Column()
    message: string;

    @Column({
        type: 'enum',
        enum: ['send', 'received'],
        default: 'send'
    })
    messageType: 'send' | 'received';

    @Column({
        nullable: true
    })
    msgId: string;

    @Column()
    messageData: string;


    @ManyToOne(
        type => DevicesEntity,
        device => device.messages
    )
    devices: DevicesEntity;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;
}