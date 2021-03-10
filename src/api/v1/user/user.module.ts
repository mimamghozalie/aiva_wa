import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// apps module
import { RoleModule } from './role/role.module';

// apps
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PermissionController } from './permission/permission.controller';
import { PermissionModule } from './permission/permission.module';
import { RoleController } from './role/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    RoleModule,
    PermissionModule
  ],
  controllers: [UserController, PermissionController, RoleController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
