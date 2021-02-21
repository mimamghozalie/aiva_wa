
import { Module } from '@nestjs/common';
import { AppSocket } from './websocket.gateaway';

@Module({
  providers: [AppSocket],
})
export class SystemSocketModule { }
