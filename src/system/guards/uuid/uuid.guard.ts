import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { uuidTest } from './uuid';

@Injectable()
export class UuidGuard implements CanActivate {
  private field;
  constructor(field?: string) {
    this.field = field;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const param = request.params;

    const testUserId = uuidTest.test(param[this.field]);
    if (!this.field || !testUserId) {
      throw new BadRequestException();
    }

    return await true;
  }
}
