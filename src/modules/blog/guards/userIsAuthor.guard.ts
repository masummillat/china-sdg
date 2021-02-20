import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { UsersService } from '../../users/service/users.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserInterface, UserRole } from '../../users/interface/user.interface';
import { BlogEntry } from '../model/blog-entry.interface';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private blogService: BlogService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const blogEntryId = Number(params.id);
    const user: UserInterface = request.user;
    console.log(user);

    return this.userService.findOne(user.id).pipe(
      switchMap((user: UserInterface) =>
        this.blogService.findOne(blogEntryId).pipe(
          map((blogEntry: BlogEntry) => {
            let hasPermission = false;
            if (user.id === blogEntry.author.id) {
              hasPermission = true;
            }
            if (user.role === UserRole.ADMIN) {
              return true;
            }
            return user && hasPermission;
          }),
        ),
      ),
    );
  }
}
