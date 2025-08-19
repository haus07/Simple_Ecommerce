import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/stategies/local.strategy';
import { JwtStrategy } from 'src/stategies/jwt.strategy';
import 'dotenv/config'

@Module({
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  imports: [UserModule, PassportModule, JwtModule.register({
    global: true,
    secret: process.env.SECRET,
    signOptions: {
      expiresIn:'15m'
    }
  })],
  exports: [JwtModule]
})
export class AuthModule {}
