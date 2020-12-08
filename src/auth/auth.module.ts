import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => [UsersModule]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '3000',
      },
    }),
  ],
  providers: [AuthService, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
