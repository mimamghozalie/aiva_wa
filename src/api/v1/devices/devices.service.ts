import { BadRequestException, Injectable } from '@nestjs/common';

// libs
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// system
import { GetQueryDto } from '@system/dto/querydata.dto';

// apps
import { UserService } from '../user/user.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { WhatsappService } from '@libs/whatsapp/whatsapp.service';


@Injectable()
export class DevicesService {

  constructor(
    private userService: UserService,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    private whatsappService: WhatsappService
  ) { }

  async create(author: string, createDeviceDto: CreateDeviceDto) {
    const checkLimit = await this.userService.getDeviceLimit(author);
    const myDevices = await this.deviceRepo.count({ where: { author } });

    // cek apakah perangkat sudah melibihi kuota
    if (myDevices < checkLimit.device_limit) {
      return this.deviceRepo.save({
        author: { id: author },
        name: createDeviceDto.name
      })
    } else if (checkLimit.device_limit == 0) {

      // Akun yang tidak memiliki kuota perangkat
      return this.deviceRepo.save({
        author: { id: author },
        name: createDeviceDto.name
      })
    } else {
      throw new BadRequestException('Payment Required.')
    }
  }

  async findAll(getQueryDto: GetQueryDto) {
    const { filter, limit, orderBy, page, search, sort, column } = getQueryDto;
    let qParam: any = {
      take: limit,
      skip: limit * (page - 1),
      order: {
        [orderBy]: sort.toUpperCase(),
      },
      relations: []
    };

    column ? qParam['select'] = column : ['deviceId', 'name', 'created', 'updated'];

    let response;

    console.log(qParam)

    if (filter) {
      const field = filter.split(':');

      response = await this.deviceRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: field[1].trim(),
        },

      });
    } else if (search) {
      const field = search.split(':');

      response = await this.deviceRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: Like(`%${field[1].trim()}%`),
        }
      });
    } else {
      response = await this.deviceRepo.findAndCount({ ...qParam });
    }

    return {
      data: response[0],
      total: response[1],
      statusCode: 200,
    };
  }

  async findOne(id: string) {
    return await this.deviceRepo.findOne({ where: { deviceId: id } });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    return await this.deviceRepo.update({ deviceId: id }, updateDeviceDto)
  }

  async remove(id: string) {
    return await this.deviceRepo.delete(id)
  }

  // Whatsapp Connection
  instance() {
    return this.whatsappService.getTotalInstance()
  }

  pair(deviceId: string) {
    return this.whatsappService.initInstance(deviceId)
  }

  destroy(deviceId: string): any {
    return this.whatsappService.instanceDestroy(deviceId);
  }
}
