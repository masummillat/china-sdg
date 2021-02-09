import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Put,
  UseGuards,
  Post,
  Request,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UsersService } from '../service/users.service';
import { Observable, of } from 'rxjs';
import { UserInterface, UserRole } from '../interface/user.interface';
import { JwtAuthGuard, Public } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { AuthorRequest } from '../interface/authorReques.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // create(@Body() user: UserEntity): Observable<UserInterface> {
  //   return this.usersService.create(user);
  // }
  @Public()
  @Get('author-requests/:id')
  findAuthorRequest(@Param('id') id: number): Observable<AuthorRequest> {
    return this.usersService.getAuthorRequest(id);
  }

  @Public()
  @Put('author-requests/:id')
  updateAuthorRequest(
    @Param('id') id: number,
    @Body() authorRequest: AuthorRequest,
  ): Observable<AuthorRequest> {
    return this.usersService.updateAuthorRequest(id, authorRequest);
  }

  @Public()
  @Delete('author-requests/:id')
  deleteAuthorRequest(@Param('id') id: number): Observable<any> {
    return this.usersService.deleteAuthorRequest(id);
  }

  @Public()
  @Get('author-requests')
  findAuthorRequests(): Observable<AuthorRequest> {
    return this.usersService.getAuthorRequests();
  }

  @Post('author-requests')
  creatAuthorRequest(@Body() authorRequest, @Request() req): Observable<any> {
    const user = req.user;
    return this.usersService.createAuthorRequest(user, authorRequest);
  }

  @Public()
  @Get('domain/:domain')
  findByDomain(@Param() params) {
    return this.usersService.findByDomain(params.domain);
  }
  @Public()
  @Get(':id')
  findOne(@Param() params) {
    return this.usersService.findOne(params.id);
  }

  @Public()
  // @Roles(UserRole.USER)
  // @UseGuards(RolesGuard)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('role') role: string | null = null,
  ): Observable<Pagination<UserInterface>> {
    // limit = limit > 100 ? 100 : limit;
    return this.usersService.findAll(
      {
        limit: Number(limit),
        page: Number(page),
        route: `${process.env.BASE_URL}/users`,
      },
      role,
    );
  }

  @Public()
  @Put('role/:id')
  updateRoleOfUser(@Param() params, @Body() user): Observable<UserInterface> {
    return this.usersService.updateRoleOfUser(params.id, user);
  }

  @Put(':id')
  updateOne(@Param() params, @Body() user): Observable<UserInterface> {
    return this.usersService.updateOne(params.id, user);
  }

  @Delete(':id')
  deleteOne(@Param() params): Observable<any> {
    return this.usersService.deleteOne(params.id);
  }
}
