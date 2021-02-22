import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AbilityService } from './ability.service';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';

@Controller('ability')
export class AbilityController {
  constructor(private readonly abilityService: AbilityService) {}

  @Post()
  create(@Body() createAbilityDto: CreateAbilityDto) {
    return this.abilityService.create(createAbilityDto);
  }

  @Get()
  findAll() {
    return this.abilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilityService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAbilityDto: UpdateAbilityDto) {
    return this.abilityService.update(+id, updateAbilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abilityService.remove(+id);
  }
}
