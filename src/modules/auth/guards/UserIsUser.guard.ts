import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../users/interface/user.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user: UserInterface = request.user;
    console.log(user);
    console.log(params)
    return this.usersService.findOne(user.id).pipe(
      map((user: UserInterface) => {
        let hasPermission = false;
        if (user.id === Number(params.id)) {
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
  }
}
