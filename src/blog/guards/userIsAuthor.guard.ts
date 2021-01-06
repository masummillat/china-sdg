import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { UsersService } from '../../users/users.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserDto } from '../../users/dto/user.dto';
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
    const user: UserDto = request.user;

    return this.userService.findOne(user.id).pipe(
      switchMap((user: UserDto) =>
        this.blogService.findOne(blogEntryId).pipe(
          map((blogEntry: BlogEntry) => {
            let hasPermission = false;
            if (user.id === blogEntry.author.id) {
              hasPermission = true;
            }
            return user && hasPermission;
          }),
        ),
      ),
    );
  }
}
