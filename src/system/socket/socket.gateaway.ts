import { SocketUser } from './client.model';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// import { WSGuard } from '../guards/wsguard/wsguard.guard';

@WebSocketGateway()
export class AppSocket {
  @WebSocketServer()
  private server: Server;

  users = new BehaviorSubject([]);

  constructor() { }

  getUsers(): Observable<SocketUser[]> {
    return this.users.pipe(
      map((socket: SocketUser[]) => {
        const socks = socket;
        return socks.map((d) => {
          delete d.socket;
          return d;
        });
      }),
    );
  }

  afterInit() { }

  private handleConnection(client: Socket) {
    const currentUsers = this.users.value;
    const origin = client.handshake.headers['origin'];
    const newUser: SocketUser = {
      id: client.id,
      origin,
      socket: client,
    };
    this.users.next([...currentUsers, newUser]);
  }

  private handleDisconnect(client: Socket) {
    const sockets = this.users.value;
    const newSocket = sockets.filter((sock) => sock.id === client.id);
    this.users.next(newSocket);
  }

  @SubscribeMessage('message')
  private handleEvent(client: Socket, data: string) {
    client.emit('message', data);
  }

  // @UseGuards(WSGuard)
  @SubscribeMessage('events')
  private shandleEvent(
    client: Socket,
    data: string,
  ): Observable<WsResponse<string>> {
    console.log(data);
    return of({
      event: 'events',
      data: data,
    });
  }
}
