import { Roles } from './../auth/decorator/roles.decorator';
import { AuthorRequestEntity } from './model/authorRequest.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { from, Observable, of, throwError } from 'rxjs';
import { UserDto, UserRole } from './dto/user.dto';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import { AuthorRequest } from './dto/authorReques.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AuthorRequestEntity)
    private authorRequestRepository: Repository<AuthorRequestEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }
  comparePassword(newPassword: string, passwordHash: string): Observable<any> {
    console.log(bcrypt.compare(newPassword, passwordHash));
    return from<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }

  generateJwt(user: UserDto): Observable<string> {
    return from(this.jwtService.signAsync(user));
  }
  validateUser(email: string, password: string): Observable<any> {
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
                console.log('match => ' + match);
                if (match) {
                  const { password, ...result } = user;
                  return result;
                } else {
                  throw new HttpException(
                    'Wrong username password',
                    HttpStatus.NOT_ACCEPTABLE,
                  );
                }
              }),
            );
          } else {
            throw new HttpException(
              'Wrong username password',
              HttpStatus.NOT_ACCEPTABLE,
            );
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
        // newUser.role = UserRole.ADMIN;
        newUser.bio = '';

        return from(this.usersRepository.save(newUser)).pipe(
          map(
            (user: UserDto) => {
              console.log(user);
              const { password, ...result } = user;
              return result;
            },
            catchError((err) => throwError(err)),
          ),
        );
      }),
    );
  }
  findAll(options: IPaginationOptions): Observable<Pagination<UserDto>> {
    return from(
      paginate<UserDto>(this.usersRepository, options, {
        relations: ['blogs'],
      }),
    ).pipe(
      map((usersPageable: Pagination<UserDto>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });
        return usersPageable;
      }),
    );
  }

  findOne(id: number): Observable<UserDto | HttpException> {
    return from(
      this.usersRepository.findOne(id, { relations: ['blogs'] }),
    ).pipe(
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

  updateOne(id: number, user: UserDto): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    return from(this.usersRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((err) => {
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      }),
    );
  }

  updateRoleOfUser(id: number, user: UserDto): Observable<any> {
    const tmpUser = new UserEntity();
    tmpUser.role = user.role;
    console.log(tmpUser);
    return from(this.usersRepository.update(id, tmpUser)).pipe(
      switchMap(() => this.findOne(id)),
      catchError((err) => {
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      }),
    );
  }
  deleteOne(id: string): Observable<any> {
    return from(this.usersRepository.delete(id));
  }
  findByMail(email: string): Observable<UserDto> {
    return from(this.usersRepository.findOne({ email }));
  }

  findByDomain(domain: string): Observable<UserDto> {
    return from(
      this.usersRepository.findOne({ domain }, { relations: ['blogs'] }),
    ).pipe(
      switchMap((domain: UserDto) => {
        if (domain) {
          return of(domain);
        }
        throw new HttpException('not found', HttpStatus.NOT_FOUND);
      }),
      catchError((err) => {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }),
    );
  }

  changePassword(
    body: { password: string; newPassword: string; confirmPassword: string },
    id: number,
    accessToken: string,
  ): Observable<any> {
    const decoded = jwt_decode(accessToken);
    console.log(decoded);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { email } = decoded;
    return this.validateUser(email, body.password).pipe(
      switchMap((user: UserDto) => {
        if (user) {
          return this.hashPassword(body.newPassword).pipe(
            switchMap((hashPassword: string) => {
              const newUser = new UserEntity();
              newUser.password = hashPassword;
              return from(this.usersRepository.update(id, newUser)).pipe(
                switchMap(() => {
                  return of({
                    message: 'Successfully updated',
                  });
                }),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Wrong password or something else',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      }),
    );
    // return this.validateUser(body.email, body.password).pipe(
    //   map((user: UserDto) => {
    //     console.log(user);
    //     return user;
    //   }),
    // );
  }

  getAuthorRequest(id: number): Observable<AuthorRequest> {
    return from(this.authorRequestRepository.findOne(id));
  }
  getAuthorRequests(): Observable<any> {
    return from(
      this.authorRequestRepository.find({
        where: { read: false },
        relations: ['author'],
      }),
    );
  }
  createAuthorRequest(
    user: UserDto,
    authorRequest: AuthorRequest,
  ): Observable<any> {
    authorRequest.author = user;
    delete authorRequest.read;
    return from(this.authorRequestRepository.save(authorRequest)).pipe(
      switchMap((value) => of(value)),
      catchError((err) => {
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      }),
    );
  }

  updateAuthorRequest(id, authorRequest: AuthorRequest): Observable<any> {
    return from(
      this.authorRequestRepository.findOne(id, { relations: ['author'] }),
    ).pipe(
      switchMap((req: AuthorRequest) => {
        console.log(req);
        const newUser = new UserEntity();
        newUser.role = UserRole.AUTHOR;
        console.log(newUser);
        return from(this.updateRoleOfUser(req.author.id, newUser)).pipe(
          switchMap(() => {
            authorRequest.read = true;
            return from(
              this.authorRequestRepository.update(id, authorRequest),
            ).pipe(switchMap(() => this.getAuthorRequest(id)));
          }),
        );
      }),
    );
  }

  deleteAuthorRequest(id): Observable<any> {
    return from(this.authorRequestRepository.delete(id)).pipe(
      switchMap(() =>
        of({
          message: 'Successfylly deleted',
          status: HttpStatus.OK,
        }),
      ),
    );
  }
}
