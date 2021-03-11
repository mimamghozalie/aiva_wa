import { Module } from '@nestjs/common';

import { SystemConfigModule } from '@system/config/config.module';
import { SystemDatabaseModule } from '@system/database/database.module';
// import { SystemSocketModule } from '@system/websocket/websocket.module';

// Application Base
// import { AppWebSocketModule } from './ws/websocket.module';
import { AppApiModule } from "./api/app-api.module";
import { SystemThrottlerModule } from './system/throttler/throttler.module';
@Module({
  imports: [
    SystemConfigModule,
    SystemThrottlerModule,
    SystemDatabaseModule,


    AppApiModule,
  ],

})
export class AppModule { }
