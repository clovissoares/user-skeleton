import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config/dist';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            inject:[ConfigService],
            useFactory: (config: ConfigService) => {
                return{
                    type: 'postgres',
                    host: config.get<string>('DATABASE_HOST'),
                    port: config.get<number>('DATABASE_PORT'),
                    username: config.get<string>('DATABASE_USER'),
                    password: config.get<string>('DATABASE_PASSWORD'),
                    database: config.get<string>('DATABASE_NAME'),
                    autoLoadEntities: true,
                    synchronize: true //DEV ONLY
                };
            }
        })
    ]
})
export class DatabaseModule {}
