import { AuthService } from './app/auth/auth.service';
import { AuthController } from './app/auth/auth.controller';
import { Module } from '@nestjs/common';

import { AppConfigModule } from '@system/config/config.module';
import { DatabaseModule } from '@system/database/database.module';
import { SocketModule } from '@system/socket/socket.module';
import { AppRoutingModule } from '@app/routing.module';

import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AppRoutingModule, SocketModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
