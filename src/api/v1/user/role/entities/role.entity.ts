import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users_role')
export class Role {
    @PrimaryGeneratedColumn('increment')
    role_id: number;

    @Column({ unique: true })
    name: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;
}
