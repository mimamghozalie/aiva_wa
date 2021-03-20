import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get('DB_TYPE').toString(),
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME').toString(),
        entities: [__dirname + './../../api/**/**/**.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    })
  ],
  providers: [DatabaseService],

})
export class SystemDatabaseModule { }
