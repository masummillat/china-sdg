import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';

import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guards/local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
