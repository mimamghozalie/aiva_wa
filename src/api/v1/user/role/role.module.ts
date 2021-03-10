import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Apps
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule { }
