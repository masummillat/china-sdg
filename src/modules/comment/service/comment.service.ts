import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../model/comment.entity';
import { Equal, Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { IComment } from '../interface/IComment';
import { UserInterface } from 'src/modules/users/interface/user.interface';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  findAllComments(blogId: number): Observable<IComment[]> {
    return from(
      this.commentRepository.find({
        relations: ['author'],
        where: {
          blog: {
            id: Equal(blogId),
          },
        },
      }),
    );
  }
  create(user: UserInterface, commentEntry: IComment): Observable<IComment> {
    console.log(user);
    commentEntry.author = user;
    return from(this.commentRepository.save(commentEntry)).pipe(
      switchMap((comment) => this.findComment(comment.id)),
    );
  }

  findComment(id): Observable<IComment> {
    return from(this.commentRepository.findOne(id, { relations: ['author'] }));
  }

  updateComment(id, commentEntry): Observable<IComment> {
    return from(this.commentRepository.update(id, commentEntry)).pipe(
      switchMap(() => this.commentRepository.findOne(id)),
    );
  }

  deleteComment(id): Observable<any> {
    return from(this.commentRepository.delete(id));
  }
}
