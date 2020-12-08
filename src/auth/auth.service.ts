import { Injectable } from '@nestjs/common';
import { from, Observable, ObservedValueOf, of } from 'rxjs';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { map, switchMap } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, // private usersService: UsersService,
  ) {}
  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }
  comparePassword(newPassword: string, passwordHash: string): Observable<any> {
    return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }

  generateJwt(user: UserDto): Observable<string> {
    console.log(user);
    return from(this.jwtService.signAsync(user));
  }

  login(user: UserDto): Observable<any> {
    // console.log(user);
    // return this.validateUser(user.email, user.password).pipe(
    //   switchMap((user: UserDto) => {
    if (user) {
      return this.generateJwt(user).pipe(
        map((jwt) => {
          return {
            access_token: jwt,
          };
        }),
      );
    }
    return from('wrong username password');
    //   }),
    // );
  }

  // validateUser(email: string, password: string): Observable<UserDto | null> {
  //   return this.usersService.findByMail(email).pipe(
  //     switchMap((user: UserDto) =>
  //       this.comparePassword(password, user.password).pipe(
  //         map((match) => {
  //           if (match) {
  //             const { password, ...result } = user;
  //             return result;
  //           } else {
  //             throw Error;
  //           }
  //         }),
  //       ),
  //     ),
  //   );
  // }
}
