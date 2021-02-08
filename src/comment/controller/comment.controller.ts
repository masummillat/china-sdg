import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CommentService } from '../service/comment.service';
import { Observable, of } from 'rxjs';
import { IComment } from '../model/IComment';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  findAllComments(): Observable<IComment[]>{
    return this.commentService.findAllComments();
  }
  @Post()
  create(@Body() commentEntry,  @Request() req): Observable<any>{
    const user= req.user;
    console.log(commentEntry)
    return  this.commentService.create(user, commentEntry);
  }

  @Get(':id')
  findComment(@Param('id') id ){
    console.log(id)
  }

  @Put(':id')
  updateComment(@Param('id') id ){
    console.log(id)
  }

  @Delete(':id')
  deleteComment(@Param('id') id ){
    console.log(id)
  }
}
