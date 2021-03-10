
import { Message } from "@api/v1/messages/entities/message.entity";
import { User } from "@api/v1/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, Entity } from "typeorm";

@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid')
    deviceId: string;

    @Column()
    name: string;

    @Column('integer', { default: 100 })
    quota: number;

    @Column('text', {
        nullable: true
    })
    qr: string;

    @Column('text', {
        nullable: true
    })
    token: string;

    @Column('boolean', {
        default: true
    })
    active: boolean;

    @Column('text', {
        nullable: true
    })
    accessToken: string;

    @Column('text', {
        nullable: true,
    })
    webhook: string;

    @Column('boolean', {
        default: false,
    })
    whatsappImage: boolean;

    @Column('boolean', {
        default: false,
    })
    whatsappVideo: boolean;

    @Column('boolean', {
        default: false,
    })
    notificationStatus: boolean;

    @Column('boolean', {
        default: false,
    })
    notificationChats: boolean;

    @CreateDateColumn()
    activeUntil: Date;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;


    // relation
    @ManyToOne(
        type => User,
        u => u.id,
    )
    author: User;

    @OneToMany(
        type => Message,
        u => u.owner,
    )
    messages: Message;
}
