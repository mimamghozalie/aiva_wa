import { Injectable, UseGuards } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';
import { WsGuard } from '@system/guards/wsguard/wsguard.guard';
import { AppSocket } from '@system/socket/socket.gateaway';
import { Socket } from 'socket.io';
import { SOCKET_POST } from './post.type';

@UseGuards(new WsGuard())
@Injectable()
export class SocketService extends AppSocket {
    constructor() { super() }

    @SubscribeMessage(SOCKET_POST.COLUMNS)
    async colums(client: Socket) {
        client.emit(SOCKET_POST.COLUMNS, ['title'])
    }
}
