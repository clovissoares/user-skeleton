import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity'
import { AuthService } from './auth.service';



@Module({
  imports: [TypeOrmModule.forFeature([User]),
   JwtModule.registerAsync({
    global:true,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION')
        }
      }
    }
  })],
  controllers: [UserController],
  providers: [UserService, AuthService]
})
export class UserModule {}
