import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
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
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
