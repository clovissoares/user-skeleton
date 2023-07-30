import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity'
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}

    create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        
        return this.userRepository.save(user);
    }

    async findOne(id : string) {
       const user = await this.userRepository.findOne({where: {id}})

       if (!user) {
        throw new NotFoundException(`User ${id} not found`);
       }

        return user;
    }

    async findByEmail(email: string){
        return await this.userRepository.findOne({where: {email}});
    }

    async findAll(paginationQueryDto: PaginationQueryDto){
    const { limit, offset } = paginationQueryDto;

    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
    }

    async update(id: string, updateUserDto: UpdateUserDto){
        const user = await this.userRepository.preload({id, ...updateUserDto}); 

        if(!user){
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.save(user);
    }

    async updateToken(id: string, refresh_token: string){
        const user = await this.userRepository.preload({id, refresh_token});

        if(!user){
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.save(user);
    }

    async remove(id: string){
        const user = await this.findOne(id);

        if(!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.remove(user);
    }
}
