import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Like, Repository } from 'typeorm';

import { ApiResponse, GetQueryData } from "@system/model/api";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }


  async findUUID(email) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id'],
    });
  }

  async findOne(id: string): Promise<ApiResponse> {

    try {
      const data = await this.userRepository.findOneOrFail(id);
      return {
        data,
        statusCode: 200
      }
    } catch (error) {
      return {
        message: 'Internal server error',
        statusCode: 500
      }
    }
  }

  async findAll(param: GetQueryData): Promise<ApiResponse> {
    try {
      const { filter, limit, orderBy, page, search, sort, column } = param;
      let qParam = {
        take: limit,
        skip: limit * (page - 1),
        order: {
          [orderBy]: sort.toUpperCase(),
        }
      };
      let response;

      if (filter) {
        const field = filter.split(':');
        response = await this.userRepository.findAndCount({
          ...qParam,
          where: {
            [field[0]]: field[1],
          },
        });
      } else if (search) {
        const field = search.split(':');
        response = await this.userRepository.findAndCount({
          ...qParam,
          where: {
            [field[0]]: Like(`%${field[1]}%`),
          },
          select: column
        });
      } else {
        response = await this.userRepository.findAndCount({ ...qParam });
      }

      return {
        data: response[0],
        total: response[1],
        statusCode: 200,
      };
    } catch (error) {
      return {
        message: 'Internal Server Error',
        statusCode: 500
      }
    }
  }

  async update(
    userId: string | string[],
    body: Partial<UserEntity>,
  ): Promise<ApiResponse> {
    try {
      const query = await this.userRepository.update(userId, body);
      if (query.affected > 0) {
        return {
          message: 'ok',
          statusCode: 200,
        };
      }
      return {
        message: 'Operasi Gagal',
        statusCode: 200
      }
    } catch (error) {
      return {
        message: 'Internal Server Error',
        statusCode: 500
      }
    }
  }

  async deleteUser(userId: string | string[]): Promise<ApiResponse> {
    try {
      const query = await this.userRepository.delete(userId);
      if (query.affected > 0) {
        return {
          message: 'Operasi Berhasil',
          statusCode: 200,
        };
      }

      return {
        message: 'Operasi Gagal',
        statusCode: 200
      }
    } catch (error) {
      return {
        message: 'Internal Server Error',
        statusCode: 500
      }
    }
  }

  async column(): Promise<ApiResponse> {

    return {
      data: ['fullname', 'email', 'role', 'status', 'created', 'updated', 'max_devices'],
      statusCode: 200
    }
  }
}
