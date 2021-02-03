import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  //   async findOrCreate() {
  //       const user = await
  //   }
  async findUUID(email) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id'],
    });
  }
}
