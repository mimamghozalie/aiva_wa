import { getConnection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppSocket } from '@system/socket/socket.gateaway';
import { SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class SocketTestProvider extends AppSocket {
  constructor() {
    super();
  }

  @SubscribeMessage('getUsers')
  gestUsers(client: Socket) {
    getConnection()
      .query('SELECT * FROM pg_database')
      .then((dbs) => {
        client.emit('message', dbs);
      });
  }

  @SubscribeMessage('testProvider')
  dasda(client: Socket, data: string) {
    client.emit('testProvider', this.users.value);
    client.emit('message', data);
  }
}
