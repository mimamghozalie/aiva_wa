
import { Device } from "@api/v1/devices/entities/device.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column({ nullable: true, unique: true, })
    phone: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        default: 1
    })
    device_limit: number;

    @Column({
        type: 'enum',
        enum: ['disabled', 'active', 'banned'],
        default: 'active',
    })
    status: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;

    // Relations
    @OneToMany(type => Device, d => d.author)
    devices: Device;

}
