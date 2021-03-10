import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
        type: 'enum',
        enum: ['disabled', 'active', 'banned'],
        default: 'active',
    })
    status: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;

}
