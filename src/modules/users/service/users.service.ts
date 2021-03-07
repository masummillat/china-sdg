import { Roles } from '../../auth/decorator/roles.decorator';
import { AuthorRequestEntity } from '../model/authorRequest.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { from, Observable, of, throwError } from 'rxjs';
import { UserInterface, UserRole } from '../interface/user.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Public } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthorRequest } from '../interface/authorReques.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import * as nodemailer from 'nodemailer';

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

  generateJwt(user: UserInterface): Observable<string> {
    return from(this.jwtService.signAsync(user));
  }

  validateUser(email: string, password: string): Observable<any> {
    return from(
      this.usersRepository.findOne(
        { email },
        {
          select: ['id', 'password', 'email', 'name', 'role'],
          relations: ['subscriptions'],
        },
      ),
    ).pipe(
      switchMap(
        (user: UserInterface): Observable<any> => {
          if (user) {
            return this.comparePassword(password, user.password).pipe(
              map((match: boolean) => {
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

  create(userData: UserInterface): Observable<any> {
    console.log(userData);
    return this.hashPassword(userData.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = userData.name;
        // newUser.username = user.username;
        newUser.email = userData.email;
        newUser.password = passwordHash;
        newUser.bio = '';
        if (userData.type === 'team') {
          newUser.type = userData.type;
          newUser.role = userData.role;
        }

        return from(this.usersRepository.save(newUser)).pipe(
          map(
            (user: UserInterface) => {
              if (user.type === 'team') {
                const transport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'jinpost2021@gmail.com',
                    pass: 'Longsicong520!',
                  },
                });
                const message = {
                  from: 'jinpost2021@gmail.com', // Sender address
                  to: `${userData.email}`, // List of recipients
                  subject: 'Team member | Jinpost', // Subject li
                  html: `
                  <div> 
                    <h1>You have been added as a team member. </h1>
                    <p>Your login credentials and role  are below</p>
                    <p><strong>Email: </strong> ${userData.email}   </p>         
                    <p><strong>Password: </strong> ${userData.password}</p>         
                    <p><strong>Role: </strong> ${userData.role}</p>         
                  </div>`,
                };
                transport.sendMail(message, function (err, info) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(info);
                  }
                });
              }
              const { password, ...result } = user;
              return result;
            },
            catchError((err) => throwError(err)),
          ),
        );
      }),
    );
  }

  findAll(
    options: IPaginationOptions,
    role: string | null,
    type: string | null,
  ): Observable<Pagination<UserInterface>> {
    console.log(role);
    console.log(type);
    if (type) {
      return from(
        paginate<UserInterface>(this.usersRepository, options, {
          relations: ['blogs'],
          where: {
            type: Equal(`${type}`),
          },
        }),
      ).pipe(
        map((usersPageable: Pagination<UserInterface>) => {
          usersPageable.items.forEach(function (v) {
            delete v.password;
          });
          return usersPageable;
        }),
      );
    }
    if (role) {
      return from(
        paginate<UserInterface>(this.usersRepository, options, {
          relations: ['blogs'],
          where: {
            role: Equal(`${role}`),
          },
        }),
      ).pipe(
        map((usersPageable: Pagination<UserInterface>) => {
          usersPageable.items.forEach(function (v) {
            delete v.password;
          });
          return usersPageable;
        }),
      );
    }
    return from(
      paginate<UserInterface>(this.usersRepository, options, {
        relations: ['blogs'],
      }),
    ).pipe(
      map((usersPageable: Pagination<UserInterface>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });
        return usersPageable;
      }),
    );
  }

  findOne(id: number): Observable<UserInterface | HttpException> {
    return from(
      this.usersRepository.findOne(id, {
        relations: ['blogs', 'subscriptions'],
      }),
    ).pipe(
      map((user: UserInterface) => {
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

  updateOne(id: number, user: UserInterface): Observable<any> {
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

  updateRoleOfUser(id: number, user: UserInterface): Observable<any> {
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

  findByMail(email: string): Observable<UserInterface> {
    return from(this.usersRepository.findOne({ email }));
  }

  findByDomain(domain: string): Observable<UserInterface> {
    return from(
      this.usersRepository.findOne({ domain }, { relations: ['blogs'] }),
    ).pipe(
      switchMap((domain: UserInterface) => {
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
      switchMap((user: UserInterface) => {
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
    //   map((user: UserInterface) => {
    //     console.log(user);
    //     return user;
    //   }),
    // );
  }

  resetPassword(body: UserInterface): Observable<any> {
    return this.hashPassword(body.password).pipe(
      switchMap((hashPassword: string) => {
        const newUser = new UserEntity();
        newUser.password = hashPassword;
        return from(this.usersRepository.update(body.id, newUser)).pipe(
          switchMap(() => {
            return of({
              message: 'Successfully updated',
            });
          }),
        );
      }),
    );
  }

  forgotPassword(body: { email: string }): Observable<any> {
    return this.findByMail(body.email).pipe(
      switchMap((user: UserInterface) => {
        if (!user) {
          throw new HttpException(
            'no user found with this email',
            HttpStatus.NOT_FOUND,
          );
        }
        return this.generateJwt({
          name: user.name,
          role: user.role,
          id: user.id,
        }).pipe(
          switchMap((jwt: string) => {
            const transport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'jinpost2021@gmail.com',
                pass: 'Longsicong520!',
              },
            });
            const message = {
              from: 'masummillat@gmail.com', // Sender address
              to: `${body.email}`, // List of recipients
              subject: 'Reset password | Jinpost', // Subject li
              html: `
              <div> 
                <h1>Click the link to reset password</h1>
                ${process.env.FRONTEND_BASE_URL}/reset-password?access_token=${jwt}&id=${user.id}         
              </div>`,
            };
            transport.sendMail(message, function (err, info) {
              if (err) {
                return of(err);
              } else {
                return of(info);
              }
            });
            return of('a mail has been send to email');
          }),
        );
      }),
      catchError((_err) => {
        console.log(_err);
        throw new HttpException(_err, HttpStatus.NOT_FOUND);
      }),
    );
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
    user: UserInterface,
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
