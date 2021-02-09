import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/service/users.service';

import { UserRole } from '../../users/interface/user.interface';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // private usersService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
