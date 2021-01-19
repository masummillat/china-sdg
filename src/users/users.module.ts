import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { AuthorRequestEntity } from './model/authorRequest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthorRequestEntity]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
