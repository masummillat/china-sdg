import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/service/blog.service';
import { BlogModule } from './blog/blog.module';
import { BlogEntryEntity } from './blog/model/blog-entry.entity';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    BlogModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, BlogEntryEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
