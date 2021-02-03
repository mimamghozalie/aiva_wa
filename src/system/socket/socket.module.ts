import { Module } from '@nestjs/common';
import { AppSocket } from './socket.gateaway';

@Module({
  providers: [AppSocket],
})
export class SocketModule {}
