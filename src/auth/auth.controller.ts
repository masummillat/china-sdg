import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('login')
  login(@Body() user: UserDto): Observable<any> {
    return this.authService.login(user);
  }
}
