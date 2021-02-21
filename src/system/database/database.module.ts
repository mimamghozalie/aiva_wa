import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { ConfigService, ConfigModule } from '@nestjs/config';


// libs
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule, ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get('DB_TYPE').toString(),
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME').toString(),
        entities: [__dirname + '../../../app/**/**.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [AppConfigModule, ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [DatabaseService],
})
export class DatabaseModule { }
