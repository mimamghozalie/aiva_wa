import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';

// libs
import { AuthGuard } from '@nestjs/passport';
import { GetQueryDto } from '@system/dto/querydata.dto';
import { Throttle } from '@nestjs/throttler';

// system
import { User } from '@system/decorators/user.decorator';

// apps
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';


@Throttle(10, 60)
@UseGuards(AuthGuard('jwt'))
@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  @Get('instance')
  isntance() {
    return this.devicesService.instance();
  }

  @Get(':id/pair')
  pairDevice(@User() user, @Param('id') id: string) {
    return this.devicesService.pair(id);
  }

  @Get(':id/destroy')
  destroyDevice(@User() user, @Param('id') id: string) {
    return this.devicesService.destroy(id);
  }

  /**
   * Devices
   * @param req 
   * @param createDeviceDto 
   * @returns 
   */

  @Post()
  create(@User() user, @Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(user.id, createDeviceDto);
  }

  @Get()
  findAll(@Query() query: GetQueryDto) {
    return this.devicesService.findAll(query);
  }

  @Get(':id/messages')
  findMessage(@Param('id') id: string, @Query() query: GetQueryDto) {
    return this.devicesService.findMessages(id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }


}
