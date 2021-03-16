import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../entities/user.entity";


@Entity('users_role')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column({ unique: true })
    name: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    updated: Date;

    // relations
    @ManyToOne(type => User, u => u.role)
    @JoinColumn({ name: 'user' })
    user: User;

}
