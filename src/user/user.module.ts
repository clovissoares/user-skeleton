import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from './entities/user.entity'
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    global:true,
    secret:"temp_secret", //ENV VAR
    signOptions: {expiresIn: '60s'},
  })],
  controllers: [UserController],
  providers: [UserService, AuthService]
})
export class UserModule {}
