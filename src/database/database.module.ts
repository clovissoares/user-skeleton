import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports:[
        TypeOrmModule.forRoot({
            type: 'postgres', //ENV VAR
            host: 'localhost', //ENV VAR
            port: 5432, //ENV VAR
            username: 'postgres', //ENV VAR
            password: 'postgres', //ENV VAR
            database: 'devdatabase', //ENV VAR
            autoLoadEntities: true,
            synchronize: true, //Dev only
        })
    ]
})
export class DatabaseModule {}
