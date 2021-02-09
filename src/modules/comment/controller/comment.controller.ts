import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CommentService } from '../service/comment.service';
import { Observable, of } from 'rxjs';
import { IComment } from '../interface/IComment';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Public()
  @Get()
  findAllComments(@Query('blogId') blogId = null): Observable<IComment[]> {
    return this.commentService.findAllComments(blogId);
  }
  @Post()
  create(@Body() commentEntry, @Request() req): Observable<any> {
    const user = req.user;
    console.log(commentEntry);
    return this.commentService.create(user, commentEntry);
  }

  @Get(':id')
  findComment(@Param('id') id): Observable<IComment> {
    return this.commentService.findComment(id);
  }

  @Put(':id')
  updateComment(@Body() commentEntry, @Param('id') id) {
    return this.commentService.updateComment(id, commentEntry);
  }

  @Delete(':id')
  deleteComment(@Param('id') id) {
    return this.commentService.deleteComment(id);
  }
}
