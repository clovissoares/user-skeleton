import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity'
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';


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

    findOne(id : string) {
       const user = this.userRepository.findOne({where: {id}})

       if (!user) {
        throw new NotFoundException(`User ${id} not found`);
       }

        return user;
    }

    async findByEmail(email: string){
        return await this.userRepository.findOne({where: {email}});
    }

    findAll(){
        return this.userRepository.find();
    }

    async update(id: string, updateUserDto: UpdateUserDto){
        const user = await this.userRepository.preload({id, ...updateUserDto}); 

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
