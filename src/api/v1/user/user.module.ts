import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// apps module
import { RoleModule } from './role/role.module';

// apps
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { RoleController } from './role/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    RoleModule,
  ],
  controllers: [RoleController, UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
