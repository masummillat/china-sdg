import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { from, Observable, of } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() user: UserEntity): Observable<UserDto> {
    return this.usersService.create(user);
  }
  @Get(':id')
  findOne(@Param() params) {
    return this.usersService.findOne(params.id);
  }
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
