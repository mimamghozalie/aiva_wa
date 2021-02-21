import { Module } from '@nestjs/common';

import { SystemConfigModule } from '@system/config/config.module';
import { DatabaseModule } from '@system/database/database.module';
import { SystemSocketModule } from '@system/websocket/websocket.module';
import { AppWebSocketModule } from './ws/websocket.module';

@Module({
  imports: [
    SystemConfigModule,
    DatabaseModule,
    SystemSocketModule,
    AppWebSocketModule
  ],

})
export class AppModule { }
