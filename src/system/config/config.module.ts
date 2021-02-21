import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './configuration';

const { NODE_ENV } = process.env;
const envFile = !NODE_ENV ? 'development' : NODE_ENV;

const path = `environtments/.env.${envFile}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path,
      validationSchema: Config,
    }),
  ],
  exports: [ConfigModule],
})
export class SystemConfigModule { }
