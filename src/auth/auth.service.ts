import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { from, Observable, ObservedValueOf, of } from 'rxjs';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  login(user: UserDto): Observable<any> {
    return this.usersService.validateUser(user.email, user.password).pipe(
      switchMap((user: UserDto) => {
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
