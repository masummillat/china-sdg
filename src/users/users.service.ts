import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { from, Observable, throwError } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: UserEntity): Observable<UserDto> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.usersRepository.save(newUser)).pipe(
          map((user: UserDto) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
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
    console.log(id);
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
