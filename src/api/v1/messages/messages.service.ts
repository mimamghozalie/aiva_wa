import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQueryDto } from '@system/dto/querydata.dto';
import { Like, Repository } from 'typeorm';
import { DevicesService } from '../devices/devices.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';


const logger = new Logger('Message')
@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @Inject(forwardRef(() => DevicesService))
    private deviceService: DevicesService
  ) { }

  async create(createMessageDto: CreateMessageDto) {
    logger.debug('send message to Whatsapp')
    const device = await this.deviceService.findByToken(createMessageDto.token);
    logger.debug('save Message')
    return this.msgRepo.save({
      ...createMessageDto,
      owner: device.deviceId
    })
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

    console.log(qParam)

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
