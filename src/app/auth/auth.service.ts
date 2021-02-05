import { UserEntity } from '@app/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from '@system/model/api';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from './auth.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }

  async onModuleInit() {
    const data: Partial<UserEntity> = {
      firstName: 'imam',
      email: 'mimamghozalie@gmail.com',
      password: '1',
      role: 'owner',
      status: 'active',
      maxDevices: 0
    };

    // Check if no user is registered
    const checkOwner = await this.userRepository.count();
    if (checkOwner > 0) {
      return;
    }

    // Create Owner Account
    const user = await this.userRepository.create(data);
    await this.userRepository.insert(user);
  }

  async register(data: RegisterUserDto): Promise<ApiResponse> {
    try {
      const { email } = data;
      let user = await this.userRepository.findOne({ where: { email } });
      if (user) {

        return await {
          message: 'User already exists',
          statusCode: 200,
        };
      }

      // Create User Account
      user = await this.userRepository.create({ ...data, status: 'disabled' });
      const createdUser = await this.userRepository.save(user);
      return await {
        message: 'Registration Success.',
        data: {
          body: createdUser,
        },
        statusCode: 201,
      };
    } catch (error) {
    }
  }

  async login(data: LoginUserDto): Promise<ApiResponse> {
    try {
      const { email, password } = data;
      const user = await this.userRepository.findOneOrFail({
        where: { email },
        select: [
          'id',
          'email',
          'firstName',
          'password',
          'status',
          'role',
        ],
      });

      if (!user || user.status !== 'active') {

        return await {
          message: 'Your account is not activated.',
          statusCode: 200,
        };
      }
      if (!user || !(await user.comparePassword(password))) {

        return await {
          message: 'Invalid email or password.',
          statusCode: 200
        };
      }

      return await {
        message: 'Authentication successfully.',
        data: {
          body: await user.withToken()
        },
      };
    } catch (error) {
      throw new BadRequestException('User not found.')
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const check = await this.userRepository.findOne(
        { email },
        { select: ['email'] },
      );
      if (check) {
        return await {
          message: 'Please check your email!',
          statusCode: 200,
        };
      } else {

        return await {
          statusCode: 200,
          message: 'User not exist',
        };
      }
    } catch (error) {

    }
  }
}
