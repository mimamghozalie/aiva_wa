import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

// third party lib's
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DevicesEntity } from '@app/devices/devices.entity';

const envConfig: any = process.env;

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,

  })
  email: string;

  @Column('text')
  firstName: string;

  @Column('text')
  password: string;

  // Sosial Media
  @Column('text', { default: '' })
  facebook_id: string;

  @Column({
    type: 'enum',
    enum: ['owner', 'admin', 'staff', 'customer', 'user'],
    default: 'user',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['disabled', 'active', 'banned'],
    default: 'active',
  })
  status: string;

  // whatsapp column

  @Column('integer', {
    default: 1
  })
  maxDevices: number;


  // relations

  @OneToMany(
    type => DevicesEntity,
    device => device.author
  )
  devices: DevicesEntity;

  @CreateDateColumn()
  created: Date;

  @CreateDateColumn()
  updated: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, email, role } = this;
    const payload = { uid: id, uemail: email }
    const param = role === 'user' ? { ...payload } : { ...payload, role };
    console.log(param)

    return jwt.sign(param, envConfig.SECRET, {
      expiresIn: envConfig.TOKEN_EXP,
    });
  }

  withToken() {
    const { id, email, token, firstName } = this;
    const user = {
      id,
      email,
      firstName,
      token,
      token_type: envConfig.TOKEN_TYPE,
    };

    return user;
  }
}
