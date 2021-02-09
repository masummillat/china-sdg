import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { from, Observable, ObservedValueOf, of } from 'rxjs';
import { UserInterface } from '../../users/interface/user.interface';
import { UsersService } from '../../users/service/users.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  login(user: UserInterface): Observable<any> {
    return this.usersService.validateUser(user.email, user.password).pipe(
      switchMap((user: UserInterface) => {
        if (user) {
          return this.usersService.generateJwt(user).pipe(
            map((jwt) => {
              return {
                access_token: jwt,
              };
            }),
          );
        }
      }),
    );
  }
}
