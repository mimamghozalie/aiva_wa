import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Apps
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStragegy } from './passport/jwt.strategy';
import { UserModule } from '@api/v1/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStragegy]
})
export class AuthModule { }
