import { UserEntity } from '@app/user/user.entity';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
const envConfig: any = process.env;

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({
    secret: envConfig.SECRET,
    signOptions: {
      expiresIn: envConfig.TOKEN_EXP
    }
  })],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
