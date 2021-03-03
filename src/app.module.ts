import { AuthorRequestEntity } from './modules/users/model/authorRequest.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/users/model/user.entity';
import { Connection } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { BlogController } from './modules/blog/blog.controller';
import { BlogService } from './modules/blog/service/blog.service';
import { BlogModule } from './modules/blog/blog.module';
import { BlogEntryEntity } from './modules/blog/model/blog-entry.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentModule } from './modules/comment/comment.module';
import { SubscriptionController } from './modules/subscription/controller/subscription.controller';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PlanService } from './modules/plan/service/plan.service';
import { PlanController } from './modules/plan/controller/plan.controller';
import { PlanModule } from './modules/plan/plan.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    BlogModule,
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, BlogEntryEntity, AuthorRequestEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CategoriesModule,
    CommentModule,
    SubscriptionModule,
    PlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
