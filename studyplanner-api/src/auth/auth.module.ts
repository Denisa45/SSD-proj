import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { UserModule } from '../user/user.module'; // ✅ Add this
import { User } from '../user/user.entity';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super_secret_key_123',
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule, // ✅ Important: makes UserService available
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
