import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string): Observable<any> {
    const user = this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user.pipe(
      switchMap((user) => {
        return of(user);
      }),
    );
  }
}
