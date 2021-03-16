import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Libs
import { Like, Repository } from 'typeorm';

// System
import { GetQueryDto } from '@system/dto/querydata.dto';

// Apps
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) { }

  async onModuleInit() {
    const check = await this.roleRepo.count();
    if (check > 0) return;

    const roles = [
      { name: 'owner' },
      { name: 'admin' },
      { name: 'user' }
    ]
    await this.roleRepo.save(roles)
  }

  async findRoleId(name: string) {
    return await this.roleRepo.findOne({ name });
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    const role = await this.roleRepo.findOne({ name });

    if (role) throw new BadRequestException('Role sudah ada.');

    return await this.roleRepo.save(createRoleDto);
  }

  async findAll(getQueryDto: GetQueryDto) {
    const { filter, limit, orderBy, page, search, sort, column } = getQueryDto;
    let qParam: any = {
      take: limit,
      skip: limit * (page - 1),
      order: {
        [orderBy]: sort.toUpperCase(),
      }
    };

    column ? qParam['select'] = column.split(',') : ['id', 'name'];

    let response;

    if (filter) {
      const field = filter.split(':');

      response = await this.roleRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: field[1].trim(),
        },

      });
    } else if (search) {
      const field = search.split(':');

      response = await this.roleRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: Like(`%${field[1].trim()}%`),
        }
      });
    } else {
      response = await this.roleRepo.findAndCount({ ...qParam });
    }

    return {
      data: response[0],
      total: response[1],
      statusCode: 200,
    };
  }

  async findOne(id: string) {
    return await this.roleRepo.findOne(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepo.update(id, updateRoleDto)
  }

  async remove(id: number) {
    return await this.roleRepo.delete(id)
  }
}
