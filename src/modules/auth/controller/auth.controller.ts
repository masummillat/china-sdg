import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserInterface } from '../../users/interface/user.interface';
import { Observable, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../../users/service/users.service';
import { UserEntity } from '../../users/model/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import * as nodemailer from 'nodemailer';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() user: UserInterface): Observable<any> {
    return this.authService.login(user);
  }
  @Post('signup')
  signup(@Body() user: UserEntity): Observable<any> {
    return this.usersService.create(user).pipe(
      map((user: UserInterface) => user),
      catchError((err) => {
        console.log(err.message);
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      }),
    );
  }

  @Post('add-team-member')
  addTeamMember(@Body() userData: UserInterface): Observable<any> {
    return this.usersService.create(userData).pipe(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map((user: UserInterface) => user),
      catchError((err) => {
        console.log(err.message);
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      }),
    );
  }
  @Post('forgot-password')
  forgotPassword(@Body() body: any): Observable<any> {
    return this.usersService.forgotPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(@Body() body: UserInterface): Observable<any> {
    return this.usersService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password/:id')
  changePassword(
    @Body() body: any,
    @Param('id') id: number,
    @Req() req,
  ): Observable<any> {
    const accessToken = req.headers.authorization.split(' ')[1];
    return this.usersService.changePassword(body, id, accessToken);
  }
}
