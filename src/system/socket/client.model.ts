import { Socket } from 'socket.io';

export interface SocketUser {
  id: string;
  origin: string;
  access_token?: string;
  socket: Socket;
}
