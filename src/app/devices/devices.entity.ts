import { UserEntity } from "@app/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('devices')
export class DevicesEntity {

    @PrimaryGeneratedColumn('uuid')
    deviceId: string;

    @Column()
    name: string;

    @Column('integer', {default: 100})
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

    @Column('text')
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
        type => UserEntity,
        user => user.id,
      )
    author: UserEntity;
}