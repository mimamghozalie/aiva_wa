import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
const envConfig: any = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== envConfig.TOKEN_TYPE) {
      throw new UnauthorizedException('Invalid token type');
    }
    const token = auth.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, envConfig.SECRET);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
