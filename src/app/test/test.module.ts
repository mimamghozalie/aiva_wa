import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SocketTestProvider } from './socket.provider';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [SocketTestProvider],
})
export class SocketTestModule {}
