import { Socket } from 'socket.io';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
const envConfig: any = process.env;

@Injectable()
export class WsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Socket = context.switchToWs().getClient();
    const token = request.handshake.query

    if (!token.authorization) {
      return false;
    }
    request['user'] = await this.validateToken(token.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== envConfig.TOKEN_TYPE) {
      throw new JsonWebTokenError('Invalid token type');
    }
    const token = auth.split(' ')[1];

    try {
      const decoded: any = await verify(token, envConfig.SECRET);
      return decoded;
    } catch (err) {
      return false;
    }
  }
}
