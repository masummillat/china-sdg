import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../model/comment.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { IComment } from '../model/IComment';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  findAllComments(): Observable<IComment[]>{
    return from(this.commentRepository.find());
  }
  create(user:UserDto, commentEntry: IComment): Observable<IComment>{
    console.log(user)
    commentEntry.author =  user;
    return from(this.commentRepository.save(commentEntry));
  }

}
