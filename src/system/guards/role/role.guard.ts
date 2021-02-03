import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  role: string;
  constructor(role: string) {
    this.role = role;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRole(request.user);
  }

  async validateRole(user: any) {
    try {
      if (!user || user?.role !== this.role) {
        throw new ForbiddenException();
      } else if (user.role === this.role) {
        return true;
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
