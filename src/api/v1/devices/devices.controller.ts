import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';

// libs
import { AuthGuard } from '@nestjs/passport';
import { GetQueryDto } from '@system/dto/querydata.dto';
import { Throttle } from '@nestjs/throttler';

// apps
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';


@UseGuards(AuthGuard('jwt'))
@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  @Throttle(5, 10)
  @Post()
  create(@Req() req, @Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(req.user.id, createDeviceDto);
  }

  @Get()
  findAll(@Query() query: GetQueryDto) {
    return this.devicesService.findAll(query);
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
