import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/stategies/local.strategy';
import { JwtStrategy } from 'src/stategies/jwt.strategy';
import 'dotenv/config'
import { GoogleStrategy } from 'src/stategies/google.stragery';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refresh_token.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,GoogleStrategy],
  imports: [TypeOrmModule.forFeature([User,RefreshToken]),UserModule, PassportModule.register({session:false}), JwtModule.register({
    global: true,
    secret: process.env.SECRET,
    signOptions: {
      expiresIn:'15m'
    }
  })],
  exports: [JwtModule]
})
export class AuthModule {}
