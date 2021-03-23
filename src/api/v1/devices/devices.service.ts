import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

// libs
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';

// system
import { GetQueryDto } from '@system/dto/querydata.dto';

// apps
import { UserService } from '../user/user.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { WhatsappService } from '@libs/whatsapp/whatsapp.service';
import { MessagesService } from '../messages/messages.service';
import { WhatsappServiceV2 } from '@libs/whatsapp/whatsappv2.service';

@Injectable()
export class DevicesService {
  private logger = new Logger(DevicesService.name);

  constructor(
    private userService: UserService,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    private whatsappService: WhatsappService,
    @Inject(forwardRef(() => MessagesService))
    private messageService: MessagesService,

    private wav2Service: WhatsappServiceV2
  ) {
    // this.whatsappService.instance
    //   .subscribe(instance => {
    //     const { deviceId, session, status } = instance
    //     this.deviceRepo.save({
    //       deviceId,
    //       session,
    //       status
    //     })
    //       .then(i => this.logger.verbose(`Instance [${status}]: ${deviceId}`))
    //       .catch(e => this.logger.warn(e.message))
    //   })
    // this.whatsappService.onMessage.subscribe(r => {
    //   console.log(r)
    // })


    this.wav2Service.startInstance("304e057e-879b-4f3e-806b-5cf4b62b64c9", { "WABrowserId": "\"WX2GPv7h6ZqI0Vi2ZnHyCQ==\"", "WASecretBundle": "{\"key\":\"ZQuo0dVIxFACrxL+/yIbYqtJfh93wD2dutz1MEG0Sko=\",\"encKey\":\"76Tbhj5nXzL0bMyN/yu0QWbzjkzXGMqj7URl+VpfDZo=\",\"macKey\":\"ZQuo0dVIxFACrxL+/yIbYqtJfh93wD2dutz1MEG0Sko=\"}", "WAToken1": "\"lDdnZo9ySfDoD5YRmdwl9syUWgwPLS/MdlxQ00D+R54=\"", "WAToken2": "\"1@oTfjkoUATgk+HCSyuY2LdPoJQ+RryZ/ZwgLIpl966hDH9ic9ofzke0kLmUEqQ2li7D0Yyu4kF+/z/w==\"" })
      .then(console.log)
      .catch(console.error)
  }

  async create(author: string, createDeviceDto: CreateDeviceDto) {
    const checkLimit = await this.userService.getDeviceLimit(author);
    const myDevices = await this.deviceRepo.count({ where: { author } });

    const data = {
      author: { id: author },
      name: createDeviceDto.name,
      token: randomBytes(16).toString('hex')
    }

    // cek apakah perangkat sudah melibihi kuota
    if (myDevices < checkLimit.device_limit) {
      return this.deviceRepo.save(data)
    } else if (checkLimit.device_limit == 0) {

      // Akun yang tidak memiliki kuota perangkat
      return this.deviceRepo.save(data)
    } else {
      throw new BadRequestException('Payment Required.')
    }
  }

  findMessages(deviceId: string, query: GetQueryDto) {
    return this.messageService.findAll(deviceId, query);
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

  async findByToken(token: string) {
    return await this.deviceRepo.findOne({ where: { token } })
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
    return this.wav2Service.startInstance(deviceId, { "WABrowserId": "\"WX2GPv7h6ZqI0Vi2ZnHyCQ==\"", "WASecretBundle": "{\"key\":\"ZQuo0dVIxFACrxL+/yIbYqtJfh93wD2dutz1MEG0Sko=\",\"encKey\":\"76Tbhj5nXzL0bMyN/yu0QWbzjkzXGMqj7URl+VpfDZo=\",\"macKey\":\"ZQuo0dVIxFACrxL+/yIbYqtJfh93wD2dutz1MEG0Sko=\"}", "WAToken1": "\"lDdnZo9ySfDoD5YRmdwl9syUWgwPLS/MdlxQ00D+R54=\"", "WAToken2": "\"1@oTfjkoUATgk+HCSyuY2LdPoJQ+RryZ/ZwgLIpl966hDH9ic9ofzke0kLmUEqQ2li7D0Yyu4kF+/z/w==\"" })
  }

  destroy(deviceId: string): any {
    return this.whatsappService.instanceDestroy(deviceId);
  }

  async sendMessage(deviceId: string, session: any, data) {
    // return new Promise(async (resolve, reject) => {
    try {
      const instance: any = this.whatsappService.getInstance(deviceId)
      console.log(instance)
      if (instance) {
        this.logger.log(`Instance found: ${deviceId}`)

        await instance?.connection?.sendMessage(`${data.to}@c.us`, data.msg)
        this.whatsappService.sendMessage(deviceId, data.to, data.msg).then(console.log).catch(console.error)
        return true;
      } else if (session) {
        this.logger.debug(`Instance not found: ${deviceId}`)
        this.whatsappService.initInstance(deviceId, session)
          .then(instance => {
            this.logger.log(`Instance created: ${deviceId}`)
            console.log(instance)
          })
          .catch(err => this.logger.error(err.message))
      }

      return null
    } catch (error) {
      console.error(error.message)
      return error.message
    }
    // this.whatsappService.getInstance(deviceId)
    //   .subscribe(device => {
    //     const instance = device?.connection;
    //     if (instance) {
    //       /**
    //        * Instance available
    //        */
    //       this.logger.log(JSON.stringify(instance), 'Device Instance')
    //       try {
    //         instance?.sendMessage(`${data.to}@c.us`, data.msg)
    //       } catch (error) {
    //         this.logger.error(`Error sending Message: ${error.message}`)
    //       }

    //       resolve('Message send successfully.')
    //     } else if (session) {
    //       this.logger.debug(`Instance ${deviceId} is Not Available.`)
    //       this.whatsappService.initInstance(deviceId, session)
    //         .then(instance => {
    //           this.logger.log(`Instance ${deviceId} ready.`)
    //           instance.sendMessage(`${data.to}@c.us`, data.msg);
    //           resolve('Message send successfully.')

    //         })
    //         .catch(err => {
    //           this.logger.warn(`Instance failed: ${err.message}`)
    //         })
    //     }

    //     reject('Please pair device.')
    //   }, err => {
    //     this.logger.error(err.message)
    //     reject(err.message)
    //   })
    // })
  }
}
