import { getConnection } from 'typeorm';
import { Injectable, UseGuards } from '@nestjs/common';
import { AppSocket } from '@system/socket/socket.gateaway';
import { SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WsGuard } from '@system/guards/wsguard/wsguard.guard';

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
  @UseGuards(new WsGuard())
  dasda(client: Socket, data: string): Observable<WsResponse<number>> {
    const event = 'message';
    const response = [1, 2, 3];

    return from(response).pipe(
      map(data => ({ event, data }))
    )
  }
}
