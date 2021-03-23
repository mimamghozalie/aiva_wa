import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQueryDto } from '@system/dto/querydata.dto';
import { Like, Repository } from 'typeorm';
import { DevicesService } from '../devices/devices.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService {
  private logger = new Logger(MessagesService.name)
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @Inject(forwardRef(() => DevicesService))
    private deviceService: DevicesService
  ) { }

  async create(createMessageDto: CreateMessageDto) {
    try {
      const device = await this.deviceService.findByToken(createMessageDto.token);
      const { deviceId, session } = device;
      const msg = await this.deviceService.sendMessage(deviceId, session, createMessageDto);

      if (msg == null) {
        return "Please pair device."
      }
      this.logger.debug('save Message')
      return this.msgRepo.save({
        ...createMessageDto,
        owner: device.deviceId
      })

    } catch (error) {
      return error
    }
  }

  async findAll(deviceId: string, query: GetQueryDto) {
    const { filter, limit, orderBy, page, search, sort, column } = query;
    let qParam: any = {
      take: limit,
      skip: limit * (page - 1),
      order: {
        [orderBy]: sort.toUpperCase(),
      },
      relations: [],
      owner: deviceId
    };

    column ? qParam['select'] = column : [];

    let response;
    if (filter) {
      const field = filter.split(':');

      response = await this.msgRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: field[1].trim(),
        },

      });
    } else if (search) {
      const field = search.split(':');

      response = await this.msgRepo.findAndCount({
        ...qParam,
        where: {
          [field[0]]: Like(`%${field[1].trim()}%`),
        }
      });
    } else {
      response = await this.msgRepo.findAndCount({ ...qParam });
    }

    return {
      data: response[0],
      total: response[1],
      statusCode: 200,
    };
  }

  findOne(id: string) {
    return this.msgRepo.findOne(id)
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: string) {
    return `This action removes a #${id} message`;
  }
}
