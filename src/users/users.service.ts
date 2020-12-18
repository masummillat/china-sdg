import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { from, Observable, of, throwError } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }
  comparePassword(newPassword: string, passwordHash: string): Observable<any> {
    return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }

  generateJwt(user: UserDto): Observable<string> {
    return from(this.jwtService.signAsync(user));
  }
  validateUser(email: string, password: string): Observable<any> {
    console.log(email)
    return from(
      this.usersRepository.findOne(
        { email },
        {
          select: ['id', 'password', 'email', 'name', 'role'],
        },
      ),
    ).pipe(
      switchMap(
        (user: UserDto): Observable<any> => {
          if (user) {
            return this.comparePassword(password, user.password).pipe(
              map((match: boolean) => {
                if (match) {
                  const { password, ...result } = user;
                  return result;
                } else {
                  throw Error;
                }
              }),
              catchError((err) => throwError(err)),
            );
          } else {
            return of(undefined);
          }
        },
      ),
    );
  }
  create(user: UserEntity): Observable<any> {
    return this.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        // newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.usersRepository.save(newUser)).pipe(
          map((user: UserDto) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) =>
            of(new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE)),
          ),
        );
      }),
    );
  }
  findAll(): Observable<UserDto[]> {
    return from(this.usersRepository.find()).pipe(
      map((users: UserDto[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }
  findOne(id: string): Observable<UserDto | HttpException> {
    return from(this.usersRepository.findOne(id)).pipe(
      map((user: UserDto) => {
        if (user) {
          const { password, ...result } = user;
          return result;
        } else {
          return new HttpException(
            {
              message: `user with password ${id} not found`,
              status: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      }),
      catchError((err) => throwError(err)),
    );
  }

  updateOne(id: string, user: UserDto): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.usersRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id)),
    );
  }
  deleteOne(id: string): Observable<any> {
    return from(this.usersRepository.delete(id));
  }
  findByMail(email: string): Observable<UserDto> {
    return from(this.usersRepository.findOne({ email }));
  }
}
