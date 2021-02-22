import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';


// libs
import { Repository } from 'typeorm';
import { hash, compare } from "bcrypt";

// Apps
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ) { }


  // async onModuleInit() {
  //   const user = {
  //     fullname: 'Mochamad Imam Ghozalie',
  //     email: 'mimamghozalie@gmail.com',
  //     password: '1',
  //     status: 'active'
  //   };

  //   // Cek apakah sudah ada pengguna
  //   const checkOwner = await this.userRepo.count();
  //   if (checkOwner > 0) { return; }

  //   // Buat akun hak akses Pemilik(owner)
  //   this.create(user).then(console.log).catch(console.error);
  // }

  async create(createUserDto: Partial<CreateUserDto>) {
    const { email } = createUserDto;
    const user = await this.userRepo.findOne({ email });
    !user ? null : new BadRequestException();

    createUserDto.password = await hash(createUserDto.password, 12)

    return await this.userRepo.save(createUserDto);
  }

  async findByPayload(payload: any) {
    const { id, phone } = payload;
    return await this.userRepo.findOne(
      { id, status: 'active' },
      { select: ['id', 'fullname', 'email', 'password', 'status', 'phone'] }
    );
  }

  async findByLogin(payload: any) {
    const { email, phone } = payload;
    const user = await this.userRepo.findOne(
      { email, status: 'active' },
      { select: ['id', 'fullname', 'email', 'password', 'status', 'phone'] }
    );
    if (!user) throw new BadRequestException();

    if (!await compare(payload.password, user.password)) throw new BadRequestException('Password salah!');

    return user;

  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({ id }, { select: ['email', 'fullname', 'phone', 'status'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update({ id }, updateUserDto)
  }

  async remove(id: string) {
    return await this.userRepo.delete(id)
  }
}
