import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() user: UserDto): Observable<any> {
    return this.authService.login(user);
  }
  @Post('signup')
  signup(@Body() user: UserEntity): Observable<any> {
    return this.usersService.create(user);
  }
}
