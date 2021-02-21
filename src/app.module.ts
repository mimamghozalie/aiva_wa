import { Module } from '@nestjs/common';

import { SystemConfigModule } from '@system/config/config.module';
import { DatabaseModule } from '@system/database/database.module';
import { SystemSocketModule } from '@system/websocket/websocket.module';

// Application Base
import { AppWebSocketModule } from './ws/websocket.module';
import { AppApiModule } from "./api/app-api.module";
@Module({
  imports: [
    SystemConfigModule,
    DatabaseModule,
    SystemSocketModule,
    AppWebSocketModule,
    AppApiModule
  ],

})
export class AppModule { }
