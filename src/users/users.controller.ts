import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { UserDto, UserRole } from './dto/user.dto';
import { JwtAuthGuard, Public } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // create(@Body() user: UserEntity): Observable<UserDto> {
  //   return this.usersService.create(user);
  // }

  @Public()
  @Get(':id')
  findOne(@Param() params) {
    return this.usersService.findOne(params.id);
  }

  @Public()
  // @Roles(UserRole.USER)
  // @UseGuards(RolesGuard)
  @Get()
  findAll(): Observable<UserDto[]> {
    return this.usersService.findAll();
  }

  @Put(':id')
  updateOne(@Param() params, @Body() user): Observable<UserDto> {
    return this.usersService.updateOne(params.id, user);
  }

  @Delete(':id')
  deleteOne(@Param() params): Observable<any> {
    return this.usersService.deleteOne(params.id);
  }
}
